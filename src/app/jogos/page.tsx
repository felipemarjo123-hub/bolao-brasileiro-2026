import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
import RoundSelector from "@/components/RoundSelector";

const MatchCard = dynamic(() => import("@/components/MatchCard"), {
  loading: () => (
    <div className="bg-card border border-slate-700 rounded-xl p-4 flex flex-col items-center animate-pulse h-48" />
  ),
});

export default async function JogosPage({
  searchParams,
}: {
  searchParams: { rodada?: string };
}) {
  const session = await getServerSession(authOptions);
  
  // Login não obrigatório por enquanto (modo preview)

  const rodada = searchParams.rodada ? parseInt(searchParams.rodada) : 19;

  const user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          roundParticipations: {
            where: { round: rodada }
          },
          invitedBy: {
            include: {
              invitedBy: true
            }
          }
        }
      })
    : null;

  const isPaid = user?.roundParticipations?.[0]?.isPaid || false;
  
  // Descobrir a Chave Pix (Seja do inviter direto se for Gerente/Dono, ou do inviter do inviter se for Colaborador)
  let pixKeyToShow = null;
  let managerName = null;
  if (user?.invitedBy) {
    if (user.invitedBy.role === 'GERENTE' || user.invitedBy.role === 'DONO') {
      pixKeyToShow = user.invitedBy.pixKey;
      managerName = user.invitedBy.name;
    } else if (user.invitedBy.role === 'COLABORADOR' && user.invitedBy.invitedBy) {
      pixKeyToShow = user.invitedBy.invitedBy.pixKey;
      managerName = user.invitedBy.invitedBy.name;
    }
  }



  // Buscar jogos da rodada
  const matches = await prisma.match.findMany({
    where: { round: rodada },
    include: {
      homeTeam: true,
      awayTeam: true,
      bets: {
        where: { userId: user?.id ?? 'none' }
      }
    },
    orderBy: { matchDate: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 border-b border-slate-700 pb-3 sm:pb-4 gap-3">
        <h1 className="text-xl sm:text-3xl font-bold text-primary">Jogos do Brasileirão</h1>
        
        <div className="flex items-center gap-2">
          <label className="text-slate-400 text-sm">Rodada:</label>
          <RoundSelector currentRound={rodada} />
        </div>
      </div>

      {!isPaid && (
        <div className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-6 mb-8 text-center shadow-[0_0_30px_rgba(234,179,8,0.1)]">
          <h2 className="text-xl font-bold text-yellow-500 mb-2">⚠️ Atenção: Seus palpites estão pendentes!</h2>
          <p className="text-slate-300 mb-4">
            Para validar sua participação e concorrer aos prêmios, realize o Pix de <strong>R$ 20,00</strong>.
          </p>
          {pixKeyToShow ? (
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-lg inline-block text-left">
              <p className="text-sm text-slate-400">Chave Pix do seu Gerente ({managerName}):</p>
              <p className="text-2xl font-black text-white select-all">{pixKeyToShow}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Procure quem te convidou para realizar o pagamento.</p>
          )}
          <p className="text-xs text-slate-500 mt-4">Após o pagamento, o gerente aprovará seu acesso automaticamente.</p>
        </div>
      )}

      {matches.length === 0 ? (
        <div className="text-center text-slate-400 py-10 bg-card rounded-xl border border-slate-800">
          Nenhum jogo cadastrado para esta rodada.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {matches.map((match) => (
            <MatchCard 
              key={match.id} 
              match={match as any} 
              userBet={match.bets[0] || null} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

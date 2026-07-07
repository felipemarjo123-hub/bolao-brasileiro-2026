import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
import RoundSelector from "@/components/RoundSelector";
import PixPaymentPanel from "@/components/PixPaymentPanel";

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
  const rodada = searchParams.rodada ? parseInt(searchParams.rodada) : 19;

  // Mock: Se não tiver logado, fingir que é o DONO
  let user = session?.user?.email
    ? await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
          roundParticipations: { where: { round: rodada } },
          invitedBy: { include: { invitedBy: true } }
        }
      })
    : {
        id: 'mock-dono-id',
        name: 'Dono (Felipe)',
        email: 'dono@bolao.com',
        role: 'DONO',
        pixKey: 'dono@bolao.com', // Chave pix do dono
        roundParticipations: [],
        invitedBy: null
      } as any;

  // MOCK: Para testar a visualização do PIX, vamos forçar isPaid = false
  // e criar uma chave Pix de mentira como se ele tivesse um gerente, só pra ele ver o QR Code
  const isPaid = false; 
  let pixKeyToShow = '00000000000'; // Chave teste
  let managerName = 'Gerente Teste';

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

      {/* Componente Client-Side de Pagamento Pix com QR Code */}
      {!isPaid && (
        <PixPaymentPanel pixKey={pixKeyToShow} managerName={managerName} amount={20} />
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

import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function DetalhesJogoPage({ params }: { params: { id: string } }) {
  const match = await prisma.match.findUnique({
    where: { id: params.id },
    include: {
      homeTeam: true,
      awayTeam: true,
      bets: {
        include: {
          user: { select: { name: true } }
        },
        orderBy: { pointsAwarded: 'desc' }
      }
    }
  });

  if (!match) return <div className="text-center py-20 text-white">Jogo não encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      <div className="bg-card border border-slate-700 rounded-xl p-8 flex flex-col items-center">
        <h1 className="text-xl text-slate-400 mb-6">Rodada {match.round} • {format(new Date(match.matchDate), "dd/MM 'às' HH:mm", { locale: ptBR })}</h1>
        
        <div className="flex items-center justify-center gap-8 w-full max-w-2xl">
          <div className="flex flex-col items-center flex-1">
            <div className="text-2xl font-bold">{match.homeTeam.name}</div>
          </div>
          
          <div className="text-5xl font-black bg-slate-900 px-6 py-3 rounded-lg border border-slate-700 text-primary">
            {match.status === 'PENDING' ? 'vs' : `${match.homeScore} x ${match.awayScore}`}
          </div>

          <div className="flex flex-col items-center flex-1">
            <div className="text-2xl font-bold">{match.awayTeam.name}</div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-white border-b border-slate-800 pb-4">Palpites da Galera</h2>
        
        {match.status === 'PENDING' ? (
          <div className="text-center text-slate-400 py-6">
            Os palpites só serão revelados após o início da partida.
          </div>
        ) : match.bets.length === 0 ? (
          <div className="text-center text-slate-400 py-6">
            Ninguém palpitou neste jogo.
          </div>
        ) : (
          <div className="space-y-3">
            {match.bets.map((bet) => (
              <div key={bet.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-lg border border-slate-800">
                <span className="font-semibold text-lg">{bet.user.name}</span>
                <div className="flex items-center gap-6">
                  <div className="text-2xl font-bold tracking-widest text-slate-200">
                    {bet.homeBetScore} <span className="text-slate-600 text-lg">x</span> {bet.awayBetScore}
                  </div>
                  {match.status === 'FINISHED' && (
                    <div className="bg-primary/20 text-primary px-3 py-1 rounded font-bold border border-primary/30">
                      +{bet.pointsAwarded} pts
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

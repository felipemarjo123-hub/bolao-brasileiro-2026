import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      standings: true,
      bets: {
        include: {
          match: {
            include: {
              homeTeam: true,
              awayTeam: true
            }
          }
        },
        orderBy: {
          match: { matchDate: 'desc' }
        },
        take: 5
      }
    }
  });

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      <div className="flex items-center gap-6 bg-card border border-slate-700 p-6 rounded-xl">
        <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center text-3xl font-bold border border-primary/50">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user.name}</h1>
          <p className="text-slate-400">{user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
          <span className="text-sm text-slate-400 mb-1">Pontos Totais</span>
          <span className="text-5xl font-black text-primary">{user.standings?.totalPoints || 0}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
          <span className="text-sm text-slate-400 mb-1">Placares Exatos</span>
          <span className="text-5xl font-black text-emerald-400">{user.standings?.exactScoreHits || 0}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center">
          <span className="text-sm text-slate-400 mb-1">Acertos Vencedor</span>
          <span className="text-5xl font-black text-blue-400">{user.standings?.winnerHits || 0}</span>
        </div>
      </div>

      <div className="bg-card border border-slate-700 p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-6 border-b border-slate-800 pb-4">Últimos Palpites</h2>
        {user.bets.length === 0 ? (
          <p className="text-slate-400 text-center py-4">Você ainda não fez nenhum palpite.</p>
        ) : (
          <div className="space-y-4">
            {user.bets.map((bet) => (
              <div key={bet.id} className="flex items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-800">
                <div className="flex items-center gap-4">
                  <span className="font-semibold w-24 text-right">{bet.match.homeTeam.shortName}</span>
                  <div className="bg-slate-800 px-3 py-1 rounded text-xl font-bold text-primary">
                    {bet.homeBetScore} x {bet.awayBetScore}
                  </div>
                  <span className="font-semibold w-24">{bet.match.awayTeam.shortName}</span>
                </div>
                <div className="text-sm text-slate-400">
                  Pts ganhos: <span className="font-bold text-white">{bet.pointsAwarded}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

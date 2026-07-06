import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (user?.role !== 'ADMIN') {
    return <div className="text-center py-20 text-red-500 font-bold">Acesso Negado</div>;
  }

  const matches = await prisma.match.findMany({
    where: { status: { not: 'FINISHED' } },
    include: { homeTeam: true, awayTeam: true },
    orderBy: { matchDate: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-red-500 mb-8 border-b border-red-500/30 pb-4">
        Painel Administrativo
      </h1>

      <div className="bg-card border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl text-white font-semibold mb-4">Atualizar Jogos Pendentes</h2>
        
        {matches.length === 0 ? (
          <p className="text-slate-400">Nenhum jogo pendente.</p>
        ) : (
          <div className="space-y-4">
            {matches.map(match => (
              <div key={match.id} className="flex flex-col md:flex-row items-center justify-between bg-slate-900 p-4 rounded-lg border border-slate-800 gap-4">
                <div className="flex-1 font-semibold">{match.homeTeam.name} x {match.awayTeam.name}</div>
                
                {/* Aqui seria um client component em produção para enviar os dados via fetch, 
                    como é um admin simples apenas de UI demonstrativa: */}
                <div className="text-sm text-slate-400">
                  ID: {match.id} <br/>
                  Utilize POST /api/admin/match/[id] para atualizar os resultados e recalcular pontos.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

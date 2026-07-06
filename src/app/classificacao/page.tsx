import { prisma } from "@/lib/prisma";

export default async function ClassificacaoPage() {
  const rankingBolao = await prisma.standingsBolao.findMany({
    include: { user: { select: { name: true } } },
    orderBy: [
      { totalPoints: 'desc' },
      { exactScoreHits: 'desc' },
      { winnerHits: 'desc' }
    ]
  });

  // Tabela Real do Campeonato Brasileiro
  const championship = await prisma.standingsChampionship.findMany({
    include: { team: true },
    // Ordenação realista do futebol
    orderBy: [
      { points: 'desc' },
      { wins: 'desc' },
      { goalsFor: 'desc' }
    ]
  });

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-16">
      
      {/* RANKING DO BOLÃO */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-700 pb-4">
          Ranking do Bolão
        </h1>

        <div className="bg-card border border-slate-700 rounded-xl overflow-hidden shadow-lg shadow-primary/5">
          <table className="w-full text-left">
            <thead className="bg-slate-900 border-b border-slate-700 text-slate-300 uppercase text-sm font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Pos</th>
                <th className="px-6 py-4">Participante</th>
                <th className="px-6 py-4 text-center text-primary">PTS</th>
                <th className="px-6 py-4 text-center hidden md:table-cell">Placares Exatos</th>
                <th className="px-6 py-4 text-center hidden md:table-cell">Acertos Vencedor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rankingBolao.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-black text-lg text-slate-400">
                    {idx + 1}º
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    {row.user.name || 'Usuário'}
                  </td>
                  <td className="px-6 py-4 text-center text-xl font-black text-primary">
                    {row.totalPoints}
                  </td>
                  <td className="px-6 py-4 text-center text-emerald-400 font-medium hidden md:table-cell">
                    {row.exactScoreHits}
                  </td>
                  <td className="px-6 py-4 text-center text-blue-400 font-medium hidden md:table-cell">
                    {row.winnerHits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {rankingBolao.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              Nenhum participante pontuou ainda.
            </div>
          )}
        </div>
      </section>

      {/* CLASSIFICAÇÃO BRASILEIRÃO 2026 */}
      <section>
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-slate-700 pb-4">
          Classificação Brasileirão 2026
        </h1>

        <div className="bg-card border border-slate-700 rounded-xl overflow-hidden shadow-lg shadow-primary/5 overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-slate-900 border-b border-slate-700 text-slate-300 text-sm font-bold">
              <tr>
                <th className="px-4 py-4 w-12 text-center">Classificação</th>
                <th className="px-4 py-4">Clube</th>
                <th className="px-4 py-4 text-center">P</th>
                <th className="px-4 py-4 text-center">J</th>
                <th className="px-4 py-4 text-center">V</th>
                <th className="px-4 py-4 text-center">E</th>
                <th className="px-4 py-4 text-center">D</th>
                <th className="px-4 py-4 text-center">GP</th>
                <th className="px-4 py-4 text-center">GC</th>
                <th className="px-4 py-4 text-center">SG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {championship.map((row, idx) => {
                const jogos = row.wins + row.draws + row.losses;
                const saldo = row.goalsFor - row.goalsAgainst;
                
                // Cores para Libertadores (1-4), Pré-Liberta (5-6), Sula (7-12) e Z4 (17-20)
                let posColor = "text-slate-400";
                if(idx < 4) posColor = "text-blue-500 font-bold";
                else if(idx < 6) posColor = "text-cyan-500 font-bold";
                else if(idx < 12) posColor = "text-emerald-500 font-bold";
                else if(idx > 15) posColor = "text-red-500 font-bold";

                return (
                  <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className={`px-4 py-3 text-center ${posColor}`}>
                      {idx + 1}
                    </td>
                    <td className="px-4 py-3 font-semibold text-white flex items-center gap-3">
                      {row.team.logoUrl && <img src={row.team.logoUrl} alt={row.team.shortName} className="w-6 h-6" />}
                      <span className="hidden md:inline">{row.team.name}</span>
                      <span className="inline md:hidden">{row.team.shortName}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-white bg-slate-900/50">{row.points}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{jogos}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{row.wins}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{row.draws}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{row.losses}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{row.goalsFor}</td>
                    <td className="px-4 py-3 text-center text-slate-300">{row.goalsAgainst}</td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-300">{saldo}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {championship.length === 0 && (
            <div className="p-8 text-center text-slate-400">
              O campeonato ainda não começou (Nenhum resultado registrado).
            </div>
          )}
        </div>
      </section>

    </div>
  );
}

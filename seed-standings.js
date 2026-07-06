const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Deletando classificação atual...");
  await prisma.standingsChampionship.deleteMany();

  const teams = await prisma.team.findMany();
  const getTeamId = (name) => teams.find(t => t.name === name).id;

  console.log("Populando Classificação Real pós Rodada 18 (Pausa da Copa 2026)...");

  const standingsData = [
    { teamName: 'Palmeiras', points: 41, wins: 13, draws: 2, losses: 3, goalsFor: 35, goalsAgainst: 14 },
    { teamName: 'Flamengo', points: 34, wins: 10, draws: 4, losses: 4, goalsFor: 30, goalsAgainst: 18 },
    { teamName: 'Fluminense', points: 31, wins: 9, draws: 4, losses: 5, goalsFor: 26, goalsAgainst: 20 },
    { teamName: 'Athletico-PR', points: 30, wins: 9, draws: 3, losses: 6, goalsFor: 25, goalsAgainst: 21 },
    { teamName: 'RB Bragantino', points: 29, wins: 8, draws: 5, losses: 5, goalsFor: 24, goalsAgainst: 20 },
    { teamName: 'Bahia', points: 26, wins: 7, draws: 5, losses: 6, goalsFor: 22, goalsAgainst: 22 },
    { teamName: 'Coritiba', points: 26, wins: 7, draws: 5, losses: 6, goalsFor: 21, goalsAgainst: 23 },
    { teamName: 'São Paulo', points: 25, wins: 7, draws: 4, losses: 7, goalsFor: 23, goalsAgainst: 20 },
    { teamName: 'Atlético-MG', points: 24, wins: 6, draws: 6, losses: 6, goalsFor: 20, goalsAgainst: 19 },
    { teamName: 'Corinthians', points: 24, wins: 6, draws: 6, losses: 6, goalsFor: 18, goalsAgainst: 17 },
    { teamName: 'Cruzeiro', points: 24, wins: 7, draws: 3, losses: 8, goalsFor: 22, goalsAgainst: 24 },
    { teamName: 'Botafogo', points: 22, wins: 6, draws: 4, losses: 8, goalsFor: 19, goalsAgainst: 22 },
    { teamName: 'Vitória', points: 22, wins: 6, draws: 4, losses: 8, goalsFor: 18, goalsAgainst: 24 },
    { teamName: 'Internacional', points: 21, wins: 5, draws: 6, losses: 7, goalsFor: 17, goalsAgainst: 21 },
    { teamName: 'Santos', points: 21, wins: 5, draws: 6, losses: 7, goalsFor: 19, goalsAgainst: 23 },
    { teamName: 'Grêmio', points: 21, wins: 6, draws: 3, losses: 9, goalsFor: 20, goalsAgainst: 26 },
    { teamName: 'Vasco', points: 20, wins: 5, draws: 5, losses: 8, goalsFor: 16, goalsAgainst: 22 },
    { teamName: 'Remo', points: 18, wins: 4, draws: 6, losses: 8, goalsFor: 15, goalsAgainst: 25 },
    { teamName: 'Mirassol', points: 16, wins: 3, draws: 7, losses: 8, goalsFor: 14, goalsAgainst: 24 },
    { teamName: 'Chapecoense', points: 9, wins: 1, draws: 6, losses: 11, goalsFor: 10, goalsAgainst: 27 },
  ];

  for (const s of standingsData) {
    try {
      await prisma.standingsChampionship.create({
        data: {
          teamId: getTeamId(s.teamName),
          points: s.points,
          wins: s.wins,
          draws: s.draws,
          losses: s.losses,
          goalsFor: s.goalsFor,
          goalsAgainst: s.goalsAgainst
        }
      });
    } catch (err) {
      console.log("Erro no time:", s.teamName, err);
    }
  }
  
  console.log("Classificação Real inserida com sucesso!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

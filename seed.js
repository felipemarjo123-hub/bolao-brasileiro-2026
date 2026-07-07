const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Deletando dados antigos...");
  await prisma.bet.deleteMany();
  await prisma.match.deleteMany();
  await prisma.standingsChampionship.deleteMany();
  await prisma.team.deleteMany();

  console.log("Inserindo Clubes com Escudos Oficiais...");

  const teamsData = [
  {
    "name": "Athletico-PR",
    "shortName": "CAP",
    "logoUrl": "/escudos/athletico-pr.svg"
  },
  {
    "name": "Atlético-MG",
    "shortName": "CAM",
    "logoUrl": "/escudos/atletico-mg.svg"
  },
  {
    "name": "Bahia",
    "shortName": "BAH",
    "logoUrl": "/escudos/bahia.svg"
  },
  {
    "name": "Botafogo",
    "shortName": "BOT",
    "logoUrl": "/escudos/botafogo.svg"
  },
  {
    "name": "Chapecoense",
    "shortName": "CHA",
    "logoUrl": "/escudos/chapecoense.png"
  },
  {
    "name": "Corinthians",
    "shortName": "COR",
    "logoUrl": "/escudos/corinthians.png"
  },
  {
    "name": "Coritiba",
    "shortName": "CFC",
    "logoUrl": "/escudos/coritiba.svg"
  },
  {
    "name": "Cruzeiro",
    "shortName": "CRU",
    "logoUrl": "/escudos/cruzeiro.svg"
  },
  {
    "name": "Flamengo",
    "shortName": "FLA",
    "logoUrl": "/escudos/flamengo.svg"
  },
  {
    "name": "Fluminense",
    "shortName": "FLU",
    "logoUrl": "/escudos/fluminense.png"
  },
  {
    "name": "Grêmio",
    "shortName": "GRE",
    "logoUrl": "/escudos/gremio.svg"
  },
  {
    "name": "Internacional",
    "shortName": "INT",
    "logoUrl": "/escudos/internacional.svg"
  },
  {
    "name": "Mirassol",
    "shortName": "MIR",
    "logoUrl": "/escudos/mirassol.svg"
  },
  {
    "name": "Palmeiras",
    "shortName": "PAL",
    "logoUrl": "/escudos/palmeiras.svg"
  },
  {
    "name": "RB Bragantino",
    "shortName": "RBB",
    "logoUrl": "/escudos/rb-bragantino.png"
  },
  {
    "name": "Remo",
    "shortName": "REM",
    "logoUrl": "/escudos/remo.svg"
  },
  {
    "name": "Santos",
    "shortName": "SAN",
    "logoUrl": "/escudos/santos.svg"
  },
  {
    "name": "São Paulo",
    "shortName": "SAO",
    "logoUrl": "/escudos/sao-paulo.png"
  },
  {
    "name": "Vasco",
    "shortName": "VAS",
    "logoUrl": "/escudos/vasco.svg"
  },
  {
    "name": "Vitória",
    "shortName": "VIT",
    "logoUrl": "/escudos/vitoria.svg"
  }
];

  const createdTeams = [];
  for (const t of teamsData) {
    const team = await prisma.team.create({ data: t });
    createdTeams.push(team);
  }

  const getTeamId = (name) => createdTeams.find(t => t.name === name).id;

  console.log("Configurando os Jogos Oficiais da 19ª Rodada (Conforme Globo Esporte - Julho 2026)...");

  // Rodada 19: Retorno Oficial pós-Copa
  const matchesData = [
    // Terça 21/07
    { homeTeamId: getTeamId('Atlético-MG'), awayTeamId: getTeamId('Bahia'), matchDate: new Date('2026-07-21T21:30:00.000Z'), round: 19 },
    { homeTeamId: getTeamId('Botafogo'), awayTeamId: getTeamId('Fluminense'), matchDate: new Date('2026-07-21T20:00:00.000Z'), round: 19 },
    
    // Quarta 22/07
    { homeTeamId: getTeamId('Internacional'), awayTeamId: getTeamId('Cruzeiro'), matchDate: new Date('2026-07-22T21:30:00.000Z'), round: 19 },
    { homeTeamId: getTeamId('São Paulo'), awayTeamId: getTeamId('Athletico-PR'), matchDate: new Date('2026-07-22T19:00:00.000Z'), round: 19 },
    { homeTeamId: getTeamId('Chapecoense'), awayTeamId: getTeamId('Flamengo'), matchDate: new Date('2026-07-22T21:30:00.000Z'), round: 19 },
    { homeTeamId: getTeamId('Grêmio'), awayTeamId: getTeamId('Vasco'), matchDate: new Date('2026-07-22T20:00:00.000Z'), round: 19 },
    
    // Quinta 23/07
    { homeTeamId: getTeamId('Corinthians'), awayTeamId: getTeamId('Remo'), matchDate: new Date('2026-07-23T21:30:00.000Z'), round: 19 },
    { homeTeamId: getTeamId('Coritiba'), awayTeamId: getTeamId('Palmeiras'), matchDate: new Date('2026-07-23T20:00:00.000Z'), round: 19 },
    { homeTeamId: getTeamId('Santos'), awayTeamId: getTeamId('Mirassol'), matchDate: new Date('2026-07-23T19:00:00.000Z'), round: 19 },
    { homeTeamId: getTeamId('Vitória'), awayTeamId: getTeamId('RB Bragantino'), matchDate: new Date('2026-07-23T19:00:00.000Z'), round: 19 },
  ];

  for (const m of matchesData) {
    await prisma.match.create({ data: m });
  }
  
  console.log("Calendário oficial da 19ª Rodada configurado!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

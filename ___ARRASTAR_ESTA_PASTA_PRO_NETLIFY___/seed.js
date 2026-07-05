const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Deletando dados antigos...");
  await prisma.bet.deleteMany();
  await prisma.match.deleteMany();
  await prisma.team.deleteMany();

  console.log("Inserindo Clubes com Escudos Oficiais...");

  const teamsData = [
    { name: 'Athletico-PR', shortName: 'CAP', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/CA_Paranaense.svg' },
    { name: 'Atlético-MG', shortName: 'CAM', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Clube_Atl%C3%A9tico_Mineiro_logo.svg' },
    { name: 'Bahia', shortName: 'BAH', logoUrl: 'https://upload.wikimedia.org/wikipedia/pt/2/2c/Esporte_Clube_Bahia_logo.svg' },
    { name: 'Botafogo', shortName: 'BOT', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Botafogo_de_Futebol_e_Regatas_logo.svg' },
    { name: 'Chapecoense', shortName: 'CHA', logoUrl: 'https://upload.wikimedia.org/wikipedia/pt/e/eb/Associa%C3%A7%C3%A3o_Chapecoense_de_Futebol_Logo.svg' },
    { name: 'Corinthians', shortName: 'COR', logoUrl: 'https://upload.wikimedia.org/wikipedia/pt/b/b4/Corinthians_s%C3%ADmbolo.png' },
    { name: 'Coritiba', shortName: 'CFC', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Coritiba_FBC_2.svg' },
    { name: 'Cruzeiro', shortName: 'CRU', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg' },
    { name: 'Flamengo', shortName: 'FLA', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Flamengo_braz_logo.svg' },
    { name: 'Fluminense', shortName: 'FLU', logoUrl: 'https://upload.wikimedia.org/wikipedia/pt/a/a3/Fluminense_FC_escudo.png' },
    { name: 'Grêmio', shortName: 'GRE', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Gr%C3%AAmio_FBPA_logo.svg' },
    { name: 'Internacional', shortName: 'INT', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg' },
    { name: 'Mirassol', shortName: 'MIR', logoUrl: 'https://upload.wikimedia.org/wikipedia/pt/0/0d/Mirassol_Futebol_Clube_logo.svg' },
    { name: 'Palmeiras', shortName: 'PAL', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
    { name: 'RB Bragantino', shortName: 'RBB', logoUrl: 'https://upload.wikimedia.org/wikipedia/pt/a/aa/Red_Bull_Bragantino.svg' },
    { name: 'Remo', shortName: 'REM', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Clube_do_Remo.svg' },
    { name: 'Santos', shortName: 'SAN', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Santos_logo.svg' },
    { name: 'São Paulo', shortName: 'SAO', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/S%C3%A3o_Paulo_Futebol_Clube.png' },
    { name: 'Vasco', shortName: 'VAS', logoUrl: 'https://upload.wikimedia.org/wikipedia/pt/a/ac/CRVascodaGama.png' },
    { name: 'Vitória', shortName: 'VIT', logoUrl: 'https://upload.wikimedia.org/wikipedia/pt/7/7b/Esporte_Clube_Vit%C3%B3ria_logo.svg' },
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

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Deletando dados antigos...");
    await prisma.bet.deleteMany();
    await prisma.match.deleteMany();
    await prisma.standingsChampionship.deleteMany();
    await prisma.team.deleteMany();

    console.log("Inserindo Clubes com Escudos Oficiais...");

    const teamsData = [
    { name: "Athletico-PR", shortName: "CAP", logoUrl: "/escudos/athletico-pr.svg" },
    { name: "Atlético-MG", shortName: "CAM", logoUrl: "/escudos/atletico-mg.svg" },
    { name: "Bahia", shortName: "BAH", logoUrl: "/escudos/bahia.svg" },
    { name: "Botafogo", shortName: "BOT", logoUrl: "/escudos/botafogo.svg" },
    { name: "Chapecoense", shortName: "CHA", logoUrl: "/escudos/chapecoense.png" },
    { name: "Corinthians", shortName: "COR", logoUrl: "/escudos/corinthians.png" },
    { name: "Coritiba", shortName: "CFC", logoUrl: "/escudos/coritiba.svg" },
    { name: "Cruzeiro", shortName: "CRU", logoUrl: "/escudos/cruzeiro.svg" },
    { name: "Flamengo", shortName: "FLA", logoUrl: "/escudos/flamengo.svg" },
    { name: "Fluminense", shortName: "FLU", logoUrl: "/escudos/fluminense.png" },
    { name: "Grêmio", shortName: "GRE", logoUrl: "/escudos/gremio.svg" },
    { name: "Internacional", shortName: "INT", logoUrl: "/escudos/internacional.svg" },
    { name: "Mirassol", shortName: "MIR", logoUrl: "/escudos/mirassol.svg" },
    { name: "Palmeiras", shortName: "PAL", logoUrl: "/escudos/palmeiras.svg" },
    { name: "RB Bragantino", shortName: "RBB", logoUrl: "/escudos/rb-bragantino.png" },
    { name: "Remo", shortName: "REM", logoUrl: "/escudos/remo.svg" },
    { name: "Santos", shortName: "SAN", logoUrl: "/escudos/santos.svg" },
    { name: "São Paulo", shortName: "SAO", logoUrl: "/escudos/sao-paulo.png" },
    { name: "Vasco", shortName: "VAS", logoUrl: "/escudos/vasco.svg" },
    { name: "Vitória", shortName: "VIT", logoUrl: "/escudos/vitoria.svg" }
    ];

    const createdTeams: any[] = [];
    for (const t of teamsData) {
      const team = await prisma.team.create({ data: t });
      createdTeams.push(team);
    }

    const getTeamId = (name: string) => createdTeams.find(t => t.name === name)!.id;

    console.log("Configurando os Jogos Oficiais da 19ª Rodada...");

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

    let roundTeams = createdTeams.map(t => t.id);
    let currentDate = new Date('2026-07-25T16:00:00.000Z');

    for (let r = 20; r <= 38; r++) {
      for (let i = 0; i < 10; i++) {
        const home = roundTeams[i];
        const away = roundTeams[19 - i];
        
        let matchDate = new Date(currentDate);
        if (i < 3) {
            matchDate.setDate(matchDate.getDate()); 
            matchDate.setHours(18, 30, 0);
        }
        else if (i < 9) {
            matchDate.setDate(matchDate.getDate() + 1); 
            matchDate.setHours(16, 0, 0);
        }
        else {
            matchDate.setDate(matchDate.getDate() + 2); 
            matchDate.setHours(20, 0, 0);
        }
        
        matchesData.push({
          homeTeamId: r % 2 === 0 ? home : away,
          awayTeamId: r % 2 === 0 ? away : home,
          matchDate: matchDate,
          round: r
        });
      }
      
      const lastTeam = roundTeams.pop()!;
      roundTeams.splice(1, 0, lastTeam);
      
      currentDate.setDate(currentDate.getDate() + 7);
    }

    for (const m of matchesData) {
      await prisma.match.create({ data: m });
    }
    
    console.log("Inserindo usuários da hierarquia (Dono, Gerente, Colaborador)...");
    
    const dono = await prisma.user.upsert({
      where: { email: 'dono@bolao.com' },
      update: { role: 'DONO' },
      create: { name: 'Dono (Felipe)', email: 'dono@bolao.com', pixKey: '11999999999', role: 'DONO' }
    });

    const gerente = await prisma.user.upsert({
      where: { email: 'gerente@bolao.com' },
      update: { role: 'GERENTE', invitedById: dono.id },
      create: { name: 'Gerente (João)', email: 'gerente@bolao.com', pixKey: 'gerente@pix.com', role: 'GERENTE', invitedById: dono.id }
    });

    await prisma.user.upsert({
      where: { email: 'colaborador@bolao.com' },
      update: { role: 'COLABORADOR', invitedById: gerente.id },
      create: { name: 'Colaborador (Pedro)', email: 'colaborador@bolao.com', pixKey: 'colaborador@pix.com', role: 'COLABORADOR', invitedById: gerente.id }
    });

    return NextResponse.json({ success: true, message: "Banco populado com sucesso (200 partidas e 3 usuários mock)!" });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

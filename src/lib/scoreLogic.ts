import { prisma } from "@/lib/prisma";

export async function calculateMatchScores(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { bets: true }
  });

  if (!match || match.status !== 'FINISHED' || match.homeScore == null || match.awayScore == null) {
    return;
  }

  const realHomeScore = match.homeScore;
  const realAwayScore = match.awayScore;
  
  const realResult = 
    realHomeScore > realAwayScore ? 'HOME' : 
    realAwayScore > realHomeScore ? 'AWAY' : 'DRAW';

  const realDiff = realHomeScore - realAwayScore;

  // 1. Atualizar Tabela do Campeonato Brasileiro Real
  await updateChampionshipStanding(match.homeTeamId, realResult === 'HOME' ? 3 : realResult === 'DRAW' ? 1 : 0, realResult === 'HOME' ? 1 : 0, realResult === 'DRAW' ? 1 : 0, realResult === 'AWAY' ? 1 : 0, realHomeScore, realAwayScore);
  await updateChampionshipStanding(match.awayTeamId, realResult === 'AWAY' ? 3 : realResult === 'DRAW' ? 1 : 0, realResult === 'AWAY' ? 1 : 0, realResult === 'DRAW' ? 1 : 0, realResult === 'HOME' ? 1 : 0, realAwayScore, realHomeScore);

  // 2. Calcular os palpites
  for (const bet of match.bets) {
    let points = 0;
    let exactHit = 0;
    let winnerHit = 0;

    const betResult = 
      bet.homeBetScore > bet.awayBetScore ? 'HOME' : 
      bet.awayBetScore > bet.homeBetScore ? 'AWAY' : 'DRAW';
    
    const betDiff = bet.homeBetScore - bet.awayBetScore;

    if (bet.homeBetScore === realHomeScore && bet.awayBetScore === realAwayScore) {
      // 1. Placar Exato: 10 pontos
      points = 10;
      exactHit = 1;
      winnerHit = 1;
    } else if (betResult === 'DRAW' && realResult === 'DRAW') {
      // 2. Acertou Empate (mas errou placar): 5 pontos
      points = 5;
    } else if (betResult === realResult && realResult !== 'DRAW') {
      // 3. Acertou Vitória (Vencedor, mas errou placar): 4 pontos
      points = 4;
      winnerHit = 1;
    } else if (betResult !== realResult && (bet.homeBetScore === realHomeScore || bet.awayBetScore === realAwayScore)) {
      // 4. Acerto de gol de um dos times SEM acertar a vitória/empate: 1 ponto
      points = 1;
    }

    await prisma.bet.update({
      where: { id: bet.id },
      data: { pointsAwarded: points }
    });

    const standings = await prisma.standingsBolao.findUnique({
      where: { userId: bet.userId }
    });

    if (standings) {
      await prisma.standingsBolao.update({
        where: { userId: bet.userId },
        data: {
          totalPoints: { increment: points },
          exactScoreHits: { increment: exactHit },
          winnerHits: { increment: winnerHit }
        }
      });
    }
  }
}

async function updateChampionshipStanding(teamId: string, points: number, wins: number, draws: number, losses: number, goalsFor: number, goalsAgainst: number) {
  const standing = await prisma.standingsChampionship.findUnique({ where: { teamId } });
  
  if (standing) {
    await prisma.standingsChampionship.update({
      where: { teamId },
      data: {
        points: { increment: points },
        wins: { increment: wins },
        draws: { increment: draws },
        losses: { increment: losses },
        goalsFor: { increment: goalsFor },
        goalsAgainst: { increment: goalsAgainst }
      }
    });
  } else {
    await prisma.standingsChampionship.create({
      data: {
        teamId,
        points,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst
      }
    });
  }
}

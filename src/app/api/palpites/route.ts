import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const { matchId, homeScore, awayScore } = await req.json();

    if (matchId == null || homeScore == null || awayScore == null) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ message: "Usuário não encontrado" }, { status: 404 });
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId }
    });

    if (!match) {
      return NextResponse.json({ message: "Partida não encontrada" }, { status: 404 });
    }

    // Verificar se o jogo já começou
    if (new Date() >= new Date(match.matchDate)) {
      return NextResponse.json({ message: "Partida já iniciada. Palpites bloqueados." }, { status: 403 });
    }

    // Upsert the bet
    const bet = await prisma.bet.upsert({
      where: {
        userId_matchId: {
          userId: user.id,
          matchId: match.id
        }
      },
      update: {
        homeBetScore: homeScore,
        awayBetScore: awayScore
      },
      create: {
        userId: user.id,
        matchId: match.id,
        homeBetScore: homeScore,
        awayBetScore: awayScore
      }
    });

    return NextResponse.json({ message: "Palpite salvo com sucesso", bet }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

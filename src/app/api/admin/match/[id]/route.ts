import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateMatchScores } from "@/lib/scoreLogic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: "Acesso restrito" }, { status: 403 });
    }

    const { homeScore, awayScore, status } = await req.json();

    const match = await prisma.match.update({
      where: { id: params.id },
      data: {
        homeScore,
        awayScore,
        status
      }
    });

    if (status === 'FINISHED') {
      await calculateMatchScores(match.id);
    }

    return NextResponse.json({ message: "Partida atualizada", match });
  } catch (error) {
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}

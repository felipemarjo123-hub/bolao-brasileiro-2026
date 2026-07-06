import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, round, isPaid } = await req.json();

    const participation = await prisma.roundParticipation.upsert({
      where: {
        userId_round: {
          userId,
          round
        }
      },
      update: {
        isPaid
      },
      create: {
        userId,
        round,
        isPaid
      }
    });

    return NextResponse.json({ success: true, participation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

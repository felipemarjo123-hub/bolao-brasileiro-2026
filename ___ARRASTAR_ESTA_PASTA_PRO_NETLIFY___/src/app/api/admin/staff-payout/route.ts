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

    const { userId, round, isPaid, amount } = await req.json();

    const payout = await prisma.staffPayout.upsert({
      where: {
        userId_round: {
          userId,
          round
        }
      },
      update: {
        isPaid,
        amount
      },
      create: {
        userId,
        round,
        isPaid,
        amount
      }
    });

    return NextResponse.json({ success: true, payout });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { maxUses } = await req.json();
    const code = "VIP-" + crypto.randomBytes(3).toString('hex').toUpperCase();

    const invite = await prisma.inviteCode.create({
      data: {
        code,
        maxUses,
        createdById: user.id
      }
    });

    return NextResponse.json({ success: true, invite });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

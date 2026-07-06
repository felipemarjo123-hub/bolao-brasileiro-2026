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

    const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!admin || admin.role !== 'DONO') {
      return NextResponse.json({ error: "Apenas o DONO pode alterar chaves Pix da equipe" }, { status: 403 });
    }

    const { userId, pixKey } = await req.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: { pixKey }
    });

    return NextResponse.json({ success: true, pixKey: user.pixKey });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, inviteCode } = await req.json();

    if (!name || !email || !password || !inviteCode) {
      return NextResponse.json({ error: "Preencha todos os campos, incluindo o Convite." }, { status: 400 });
    }

    // Validar Código de Convite
    const invite = await prisma.inviteCode.findUnique({
      where: { code: inviteCode }
    });

    if (!invite) {
      return NextResponse.json({ error: "Código de convite inválido." }, { status: 400 });
    }

    if (invite.currentUses >= invite.maxUses) {
      return NextResponse.json({ error: "Este convite esgotou o limite de usos (1000/1000)." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "E-mail já está em uso" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: passwordHash,
        invitedById: invite.createdById // Vincula o jogador à árvore do dono do link
      },
    });

    // Criar a carteira de standings vazia para o usuário
    await prisma.standingsBolao.create({
      data: {
        userId: user.id
      }
    });

    // Incrementa o uso do convite
    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: { currentUses: invite.currentUses + 1 }
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

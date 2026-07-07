const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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

  console.log('Mock users created!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

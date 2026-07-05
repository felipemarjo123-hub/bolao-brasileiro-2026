const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Criando convite inicial...");

  const code = 'BOLAO1000';
  const existing = await prisma.inviteCode.findUnique({ where: { code } });

  if (!existing) {
    await prisma.inviteCode.create({
      data: {
        code: code,
        maxUses: 1000,
        currentUses: 0
      }
    });
    console.log(`Convite ${code} (Max: 1000) criado com sucesso!`);
  } else {
    console.log(`Convite ${code} já existia.`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

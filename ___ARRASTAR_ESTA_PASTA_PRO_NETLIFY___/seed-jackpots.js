const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Criando Acumulados iniciais (Jackpots)...");

  const jackpots = [
    { type: '6_EXACTOS', amount: 1000.0 },
    { type: '10_ACERTOS', amount: 1000.0 }
  ];

  for (const j of jackpots) {
    const existing = await prisma.jackpot.findUnique({ where: { type: j.type } });
    if (!existing) {
      await prisma.jackpot.create({ data: j });
      console.log(`Jackpot ${j.type} criado com R$ ${j.amount}.`);
    } else {
      console.log(`Jackpot ${j.type} já existe.`);
    }
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

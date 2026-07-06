const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Inserindo Jorge Dias no Bolão...");

  let user = await prisma.user.findUnique({ where: { email: 'jorge@email.com' } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Jorge Dias',
        email: 'jorge@email.com',
        passwordHash: '123456' // Apenas simbólico
      }
    });
  }

  // Verificar se ele já tem ranking
  const ranking = await prisma.standingsBolao.findUnique({ where: { userId: user.id } });
  
  if (!ranking) {
    await prisma.standingsBolao.create({
      data: {
        userId: user.id,
        totalPoints: 58,
        exactScoreHits: 5,
        winnerHits: 8
      }
    });
  } else {
    await prisma.standingsBolao.update({
      where: { userId: user.id },
      data: {
        totalPoints: 58
      }
    });
  }
  
  console.log("Jorge Dias inserido com 58 pontos com sucesso!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

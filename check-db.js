const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const matches = await prisma.match.count();
  const teams = await prisma.team.count();
  console.log(`Matches in DB: ${matches}`);
  console.log(`Teams in DB: ${teams}`);
}

check().catch(console.error).finally(() => prisma.$disconnect());

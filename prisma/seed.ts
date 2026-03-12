import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$transaction(async (tx) => {
      //TODO: Seed users and their profile
    });

    console.log('Database seeding completed successfully.');
  } catch (e) {
    throw e;
  }
}

main()
  .catch((e) => {
    console.error('Error occured while running db seed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

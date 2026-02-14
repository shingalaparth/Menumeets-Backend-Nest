const { PrismaClient } = require('@prisma/client');

async function check() {
    const prisma = new PrismaClient();
    console.log('Checking Prisma Client properties...');
    console.log('waiterCall exists:', !!prisma.waiterCall);
    console.log('settlement exists:', !!prisma.settlement);
    console.log('auditLog exists:', !!prisma.auditLog);
    await prisma.$disconnect();
}

check().catch(console.error);

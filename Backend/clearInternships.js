const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearInternships() {
    try {
        await prisma.cachedScore.deleteMany({});
        console.log('All cached scores deleted successfully.');

        await prisma.internship.deleteMany({});
        console.log('All internships deleted successfully.');
    } catch (error) {
        console.error('Error deleting internships:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearInternships();

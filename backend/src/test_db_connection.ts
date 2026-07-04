import { PrismaClient } from './generated/prisma/client';
const prisma = new PrismaClient();

async function testConnection() {  
    console.log("Testing database connection...");   
    try{
        await prisma.$queryRaw`SELECT 1`;
        console.log("Database connection successful!");

    }catch (error) {
        console.error("Database connection failed:", error);
        console.error(error);
    }finally{
        await prisma.$disconnect();
    }
}
testConnection();

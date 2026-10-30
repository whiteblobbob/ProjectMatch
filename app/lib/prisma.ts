import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalThisPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalThisPrisma.prisma || new PrismaClient({
  adapter: new PrismaPg({
    connectionString: `${process.env.DATABASE_URL}`,
    max: 3,
  }),
});

if(process.env.NODE_ENV === "development") globalThisPrisma.prisma = prisma;

export default prisma;
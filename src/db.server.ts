import { PrismaClient } from '@prisma/client';

const db = global.__db || new PrismaClient();

export { db };

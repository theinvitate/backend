import { PrismaClient } from '@prisma/client';

/* eslint-disable import/no-mutable-exports */
let db = null;

if (!db) {
	db = new PrismaClient();
}

export { db };
/* eslint-enable import/no-mutable-exports */

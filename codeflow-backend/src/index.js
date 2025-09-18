import dotenv from 'dotenv';
import { db } from './libs/db.js';
import app from './app.js';

dotenv.config({
    path: './.env',
});

const PORT = process.env.PORT || 4000;

async function main() {
    try {
        await db.$connect();
        console.log('✅ Connected to Prisma Database');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error connecting to Prisma DB:', error);
        process.exit(1);
    }
}

main();

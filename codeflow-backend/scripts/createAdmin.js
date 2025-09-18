import { db } from "../src/libs/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  const existingAdmin = await db.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (existingAdmin) {
    console.log('🚫 Admin already exists:', existingAdmin.email);
    return;
  }

  const admin = await db.user.create({
    data: {
      fullname: 'superadmin' ,
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'ADMIN',
      isEmailVerified: true,
    },
  });

  console.log('✅ Admin created:', admin.email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

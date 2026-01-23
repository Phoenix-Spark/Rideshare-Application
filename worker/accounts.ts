// worker/account.ts
import { prisma } from '../server/db.server';

const EXPIRY_MINUTES = 120; 

export async function AccountCleanup() {
  const expiryTime = new Date(Date.now() - EXPIRY_MINUTES * 60 * 1000);
  
  console.log(`[${new Date().toISOString()}] 🔍 Checking for expired accounts...`);
  
  const result = await prisma.user.deleteMany({
    where: {
      emailVerified: false,
      createdAt: { lt: expiryTime },
      updatedAt: { lt: expiryTime },
    },
  });
  
  if (result.count > 0) {
    console.log(`[${new Date().toISOString()}] 🧹 Deleted ${result.count} expired accounts`);
  } else {
    console.log(`[${new Date().toISOString()}] ✅ No expired accounts found`);
  }
  
  return result.count;
}
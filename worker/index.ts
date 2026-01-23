// worker/index.ts
import { CronJob } from 'cron';
import { AccountCleanup } from './accounts';

console.log('🚀 Starting cleanup worker...');

// Run cleanup every 15 minutes (production)
// Accounts expire after 2 hours of inactivity
// Running cleanup every 15 min ensures accounts are deleted within 2h 15min max
const cleanupJob = new CronJob(
  '*/15 * * * *',  // Testing: every 1 minute | Production: '*/15 * * * *'
  async () => {
    try {
      await AccountCleanup();
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ Cleanup failed:`, error);
    }
  },
  null,
  true,
  'UTC'
);

console.log('✅ Cleanup job scheduled'); // Update for production
console.log('🔄 Running initial cleanup...');

AccountCleanup().catch(console.error);

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down...');
  cleanupJob.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Shutting down...');
  cleanupJob.stop();
  process.exit(0);
});
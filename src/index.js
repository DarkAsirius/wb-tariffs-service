const cron = require('node-cron');
const db = require('./db');
const { fetchAndSaveTariffs } = require('./tasks/fetchTariffs');
const { exportToGoogleSheets } = require('./tasks/exportToSheets');

async function waitForDb(retries = 10, delay = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      await db.raw('SELECT 1');
      console.log('Database connected');
      return;
    } catch (err) {
      console.log(`Waiting for database... (${i + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error('Database connection failed');
}

async function start() {
  await waitForDb();

  await db.migrate.latest();
  console.log('Migrations applied');

  await fetchAndSaveTariffs();
  await exportToGoogleSheets();

  cron.schedule('0 * * * *', async () => {
    await fetchAndSaveTariffs();
    await exportToGoogleSheets();
  });

  console.log('Service started. Fetching tariffs every hour.');
}

start().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
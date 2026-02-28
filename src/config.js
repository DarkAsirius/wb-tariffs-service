require('dotenv').config();

module.exports = {
  wb: {
    apiToken: process.env.WB_API_TOKEN,
    tariffsUrl: 'https://common-api.wildberries.ru/api/v1/tariffs/box',
  },
  db: {
    host: process.env.DB_HOST || 'db',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres',
  },
  google: {
    sheetIds: (process.env.GOOGLE_SHEETS_IDS || '').split(',').filter(Boolean),
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
  },
};
const db = require('../db');
const config = require('../config');
const { writeToSheet } = require('../services/googleSheets');

/**
 * Выгружает тарифы из БД в Google Sheets
 */
async function exportToGoogleSheets() {
  console.log(`[${new Date().toISOString()}] Exporting tariffs to Google Sheets...`);

  try {
    // Получаем данные, отсортированные по коэффициенту
    const tariffs = await db('box_tariffs')
      .select('*')
      .orderBy('box_delivery_and_storage_expr', 'asc');

    if (tariffs.length === 0) {
      console.log('No tariffs to export');
      return;
    }

    // Формируем строки: заголовок + данные
    const header = [
      'Дата',
      'Склад',
      'Коэффициент',
      'Доставка база',
      'Доставка литр',
      'Хранение база',
      'Хранение литр',
      'Обновлено',
    ];

    const rows = tariffs.map((t) => [
      t.date,
      t.warehouse_name,
      t.box_delivery_and_storage_expr,
      t.box_delivery_base,
      t.box_delivery_liter,
      t.box_storage_base,
      t.box_storage_liter,
      t.updated_at,
    ]);

    const data = [header, ...rows];

    // Пишем в каждую таблицу
    for (const sheetId of config.google.sheetIds) {
      await writeToSheet(sheetId, data);
      console.log(`Written to sheet: ${sheetId}`);
    }

    console.log(`[${new Date().toISOString()}] Export complete`);
  } catch (error) {
    console.error('Error exporting to sheets:', error.message);
  }
}

module.exports = { exportToGoogleSheets };
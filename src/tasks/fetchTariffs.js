const db = require('../db');
const { fetchBoxTariffs } = require('../services/wbApi');

/**
 * Получает тарифы и сохраняет/обновляет в БД
 */
async function fetchAndSaveTariffs() {
  console.log(`[${new Date().toISOString()}] Fetching tariffs from WB API...`);

  try {
    const warehouses = await fetchBoxTariffs();
    const today = new Date().toISOString().split('T')[0];

    for (const wh of warehouses) {
      const row = {
        date: today,
        warehouse_name: wh.warehouseName,
        box_delivery_and_storage_expr: parseFloat(wh.boxDeliveryAndStorageExpr) || 0,
        box_delivery_base: parseFloat(wh.boxDeliveryBase) || 0,
        box_delivery_liter: parseFloat(wh.boxDeliveryLiter) || 0,
        box_storage_base: parseFloat(wh.boxStorageBase) || 0,
        box_storage_liter: parseFloat(wh.boxStorageLiter) || 0,
        updated_at: new Date(),
      };

      // UPSERT: вставить или обновить если за этот день+склад уже есть
      await db.raw(
        `INSERT INTO box_tariffs (date, warehouse_name, box_delivery_and_storage_expr, 
          box_delivery_base, box_delivery_liter, box_storage_base, box_storage_liter, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (date, warehouse_name)
         DO UPDATE SET
           box_delivery_and_storage_expr = EXCLUDED.box_delivery_and_storage_expr,
           box_delivery_base = EXCLUDED.box_delivery_base,
           box_delivery_liter = EXCLUDED.box_delivery_liter,
           box_storage_base = EXCLUDED.box_storage_base,
           box_storage_liter = EXCLUDED.box_storage_liter,
           updated_at = EXCLUDED.updated_at`,
        [
          row.date,
          row.warehouse_name,
          row.box_delivery_and_storage_expr,
          row.box_delivery_base,
          row.box_delivery_liter,
          row.box_storage_base,
          row.box_storage_liter,
          row.updated_at,
        ]
      );
    }

    console.log(`[${new Date().toISOString()}] Saved ${warehouses.length} tariffs for ${today}`);
  } catch (error) {
    console.error('Error fetching tariffs:', error.message);
  }
}

module.exports = { fetchAndSaveTariffs };
const axios = require('axios');
const config = require('../config');

/**
 * @returns {Promise<Array>}
 */
async function fetchBoxTariffs() {
  const today = new Date().toISOString().split('T')[0];

  const response = await axios.get(config.wb.tariffsUrl, {
    headers: {
      Authorization: config.wb.apiToken,
    },
    params: {
      date: today,
    },
  });

  const data = response.data?.response?.data;

  if (!data || !data.warehouseList) {
    throw new Error('Неожиданный формат ответа WB API');
  }

  return data.warehouseList;
}

module.exports = { fetchBoxTariffs };
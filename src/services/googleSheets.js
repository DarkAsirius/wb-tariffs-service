const { google } = require('googleapis');
const config = require('../config');


function getSheetsClient() {
  const auth = new google.auth.JWT(
    config.google.serviceAccountEmail,
    null,
    config.google.privateKey,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  return google.sheets({ version: 'v4', auth });
}

/**
 * @param {string} spreadsheetId 
 * @param {Array<Array>} rows
 */
async function writeToSheet(spreadsheetId, rows) {
  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: 'stocks_coefs',
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'stocks_coefs!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: rows,
    },
  });
}

module.exports = { writeToSheet };
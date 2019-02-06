
const query = require('../../src/common/db');

async function getActivationCode(email) {
  const result = await query('select activationCode from member where email = ?', [email]);
  return await result[0][0].activationCode;
}

module.exports = getActivationCode;
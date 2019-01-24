'use strict';
const query = require('../common/db');
const response = require('./response');

module.exports.handler = async (event, context) => {

  try {
    const id = 1;
    const result = await query('select * from application where id = ?', id);
    return response.ok(result[0]);
  } catch(error) {
    return response.error(error);
  }

};
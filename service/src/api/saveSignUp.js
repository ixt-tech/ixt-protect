'use strict';

const getConnection = require('../db/pool');

module.exports.handler = async (event, context) => {

  const connection = getConnection();
  console.log(connection);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Sign up saved successfully',
      input: event,
    }),
  };

};

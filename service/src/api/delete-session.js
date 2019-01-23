'use strict';

module.exports.handler = async (event, context) => {

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Success',
      input: event,
    }),
  };

};

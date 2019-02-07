
function ok(data) {
  return json(200, data);
}

function error(error) {
  return json(error.code, error.message)
}

function serverError(data) {
  return json(500, data);
}

function json(statusCode, data, headers = {}) {
  return ({
    statusCode,
    headers: Object.assign({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }, headers),
    body: JSON.stringify(data),
  });
}

module.exports = {
  ok,
  error,
  serverError,
  json
};
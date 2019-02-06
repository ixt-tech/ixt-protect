'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const utils = require('./utils');

let pubkey = fs.readFileSync(path.join(__dirname, '../jwt/jwt.pub.key'), 'utf-8');

function getSession(event) {

  const headers = event.headers;
  // first check we got valid headers
  if (headers !== null && headers !== undefined) {
    // now get the token header
    let accessTokenHeader = headers['x-access-token'];
    try {
      const session = utils.decryptJwt(accessTokenHeader);
      console.log(session);
      return session;
    } catch(error) {
      return undefined;
    }
  }

}

module.exports = getSession;
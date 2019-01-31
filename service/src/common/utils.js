'use strict';

const moment = require('moment');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const SHA3 = require('crypto-js/sha3');
const crypto = require('crypto');
const privkey = fs.readFileSync(path.join(__dirname, '../jwt/jwt.priv.key'), 'utf-8');
const pubkey = fs.readFileSync(path.join(__dirname, '../jwt/jwt.pub.key'), 'utf-8');

function toSqlDate(millis) {
  return moment.utc(millis).format('YYYY-MM-DD');
}

function toSqlTimestamp(millis) {
  return moment.utc(millis).format('YYYY-MM-DD hh:mm:ss');
}

function createJwt(payload) {
  return jwt.sign(payload, privkey, { algorithm: 'RS256' });
}

function decryptJwt(token) {
  return jwt.verify(token, pubkey, { algorithm: 'RS256' });
}

function hashPassword(password) {
  return SHA3(password).toString();
}

function hashToHEX(str) {
  return str.replace('#', '%23');
}

function generateSalt(length) {
  return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
}

module.exports = {
  toSqlDate,
  toSqlTimestamp,
  hashToHEX,
  createJwt,
  decryptJwt: decryptJwt,
  hashPassword,
  generateSalt
};
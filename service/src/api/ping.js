'use strict';

const response = require('./response');
const moment = require('moment');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  return response.ok({ message: 'Received ping at ' + moment.utc().format('DD-MM-YYYY hh:mm:ss') });

};
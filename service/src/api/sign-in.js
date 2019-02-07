'use strict';

const moment = require('moment');
const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  try {
    const credentials = JSON.parse(event.body);
    // validate
    const accessToken = await memberService.signIn(credentials.email, credentials.password);
    return response.ok({accessToken: accessToken});
  } catch(error) {
    return response.error(error);
  }

};

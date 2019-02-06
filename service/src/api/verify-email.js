'use strict';

const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  try {
    const credentials = JSON.parse(event.body);
    await memberService.verifyEmail(credentials);
    return response.ok();
  } catch(error) {
    return response.error(error);
  }

};

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
    console.error('An unexpected error occurred', error);
    return response.error(error);
  }

};

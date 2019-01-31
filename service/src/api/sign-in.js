'use strict';

const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  try {
    const credentials = JSON.parse(event.body);
    // validate

    const token = await memberService.authenticate(credentials.email, credentials.password);
    return response.ok({token: token});
  } catch(error) {
    return response.error(error);
  }

};

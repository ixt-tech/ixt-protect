'use strict';

const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  try {
    const request = JSON.parse(event.body);
    const activationCode = request.activationCode;
    const result = await memberService.activate(activationCode);
    return response.ok(result);
  } catch(error) {
    return response.error(error);
  }

};

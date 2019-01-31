'use strict';

const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  try {
    const member = JSON.parse(event.body);
    const result = await memberService.updateMember(member);
    return response.ok(result);
  } catch(error) {
    return response.error(error);
  }

};

'use strict';
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  try {
    const session = getSession(event);
    if(!session) return response.error({ code: 403, message: 'You must sign in first' });
    await memberService.deleteMember(session.memberId);
    return response.ok();
  } catch(error) {
    return response.error(error);
  }

};
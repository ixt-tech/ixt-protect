'use strict';

const getSession = require('../common/auth');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  const session = await getSession(event);
  if(!session) return response.error({ code: 403, message: 'You must sign in first' });

  try {
    await memberService.deleteMember(session.memberId);
    return response.ok();
  } catch(error) {
    return response.error(error);
  }

};
'use strict';

const response = require('./response');
const getSession = require('../common/auth');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  const session = await getSession(event);
  if(!session) return response.error({ code: 403, message: 'You must sign in first' });

  const redemption =  JSON.parse(event.body);
  await memberService.redeem(session.memberId, redemption);
  return response.ok('');

};
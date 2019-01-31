'use strict';

const response = require('./response');
const getSession = require('../common/auth');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  const session = getSession(event);
  if(!session) return response.error({ code: 403, message: 'You must sign in first' });

  const member = await memberService.getMemberByEmail(session.email);
  return response.ok(member);

};
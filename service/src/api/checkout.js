'use strict';

const getSession = require('../common/auth');
const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  const session = await getSession(event);
  if(!session) return response.error({ code: 403, message: 'You must sign in first' });

  try {
    const body = JSON.parse(event.body);
    const member = body.account;
    const paymentToken = body.paymentToken;
    const result = await memberService.checkout(member, paymentToken);
    return response.ok(result);
  } catch(error) {
    return response.error(error);
  }

};

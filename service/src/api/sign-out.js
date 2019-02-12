'use strict';

const getSession = require('../common/auth');
const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  const session = await getSession(event);
  if(session) {
    await memberService.signOut(session.memberId);
  }
  return response.ok({message: 'You signed out'});

};

'use strict';

const getSession = require('../common/auth');
const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  const session = getSession(event);
  if(session) {
    //
  }
  return response.ok({message: 'You signed out'});

};

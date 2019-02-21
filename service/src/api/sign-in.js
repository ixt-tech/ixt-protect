'use strict';

const moment = require('moment');
const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  try {
    const credentials = JSON.parse(event.body);
    // validate
    if(!credentials.email
      || credentials.email == ''
      || !credentials.password
      || credentials.password == '') {
      throw { code: 403, message: 'Sign in failed' };
    }
    const accessToken = await memberService.signIn(credentials.email, credentials.password);
    const member = await memberService.getMemberByEmail(credentials.email);
    return response.ok({accessToken: accessToken, account: member});
  } catch(error) {
    return response.error(error);
  }

};

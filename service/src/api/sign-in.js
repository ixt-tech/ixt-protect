'use strict';

const moment = require('moment');
const response = require('./response');
const MemberService = require('../service/member-service');
const memberService = new MemberService();

module.exports.handler = async (event, context) => {

  try {
    const credentials = JSON.parse(event.body);
    // validate

    const accessToken = await memberService.signIn(credentials.email, credentials.password);

    let target = '/account';
    const member = await memberService.getMemberByEmail(credentials.email);
    if(member.status == 'NEW') {
      target = '/activate';
    } else if(member.status == 'VERIFIED') {
      target = '/personal-details';
    }
    return response.ok({accessToken: accessToken, redirect: target, account: member});
  } catch(error) {
    return response.error(error);
  }

};

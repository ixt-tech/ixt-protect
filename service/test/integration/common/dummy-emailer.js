'use strict';

class Emailer {

  constructor() {
  }

  sendEmailVerification(member) {
    console.log('Sending dummy activation', member);
    this.activationCode = member.activationCode;
  }

}

module.exports = Emailer;

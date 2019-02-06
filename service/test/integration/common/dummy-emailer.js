'use strict';

class Emailer {

  constructor() {
    this.activationCode = '';
  }

  sendEmailVerification(credentials) {
    this.activationCode = credentials.activationCode;
  }

  getActivationCode() {
    return this.activationCode;
  }

}

module.exports = Emailer;

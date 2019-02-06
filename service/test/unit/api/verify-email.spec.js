'use strict';

const proxyquire = require('proxyquire');
const request = require('supertest');
const expect = require('chai').expect;
const uuid = require('uuid/v1');
const emailer = new require('../../integration/common/dummy-emailer');
const MemberService = proxyquire('../../../src/service/member-service', {
  '../common/emailer': emailer
});

const verifyEmail = proxyquire('../../../src/api/verify-email', {
  '../service/member-service': MemberService
});
const activate = proxyquire('../../../src/api/activate', {
  '../service/member-service': MemberService
});
const signUp = proxyquire('../../../src/api/sign-up', {
  '../service/member-service': MemberService
});

const getActivationCode = require('../../integration/getActivationCode');

describe('verifyEmail', function test() {

  let credentials = {
    email: 'email' + uuid(),
    password: 'password',
    invitationCode: 'invitation code'
  };

  it('activate', function test(done) {

    // Verify email
    verifyEmail.handler({ body: JSON.stringify(credentials) }, {}).then(function (response) {
      expect(response.statusCode).to.equal(200);

      // Activate account
      getActivationCode(credentials.email).then(function (activationCode) {
        expect(activationCode).exist;

        activate.handler({ body: activationCode }, {}).then(function (r) {
          expect(r.statusCode).to.equal(200);
          const response = JSON.parse(r.body);
          const account = response.account;
          const sessionToken = response.sessionToken;

          // Complete
//          signUp.handler({ body: JSON.stringify()})

          done();
        });


        done();
      });
    });
  });

});
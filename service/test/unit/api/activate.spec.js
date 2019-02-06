'use strict';

const request = require('supertest');
const expect = require('chai').expect;
const uuid = require('uuid/v1');
const moment = require('moment');
const Emailer = require('../../integration/common/dummy-emailer');
const emailer = new Emailer();
const proxyquire = require('proxyquire');

const MemberService = proxyquire('../../../src/service/member-service', {
  '../common/emailer': Emailer
});

const activate = proxyquire('../../../src/api/activate', {
  '../service/member-service': MemberService
});

const activate = require('../../../src/api/activate');

describe('activate', function test() {

  let credentials = {
    email: 'email' + uuid(),
    password: 'password',
    invitationCode: 'invitation code'
  };

  it('activate', function test(done) {

    activate.handler({ body: JSON.stringify(credentials) }, {}).then(function (response) {
      expect(response.statusCode).to.equal(200);
      const activationCode = emailer.activationCode;
      console.log(activationCode);
      activateMember.handler({ body: activationCode }, {}).then(function (response) {
        const token = response.body;
        expect(response.statusCode).to.equal(200);
        console.log(emailer.activationCode)
        expect(token).exist;
        done();
      });
    });
  });

});
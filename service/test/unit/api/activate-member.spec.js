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

const signUp = proxyquire('../../../src/api/sign-up', {
  '../service/member-service': MemberService
});

const activateMember = require('../../../src/api/activate-member');

describe('activateMember', function test() {

  let member = {
    firstName: 'first name',
    lastName: 'last name',
    dateOfBirth: moment("1977-04-03").valueOf(),
    email: 'email' + uuid(),
    telephone: 'telephone',
    addressLine1: 'address line 1',
    addressLine2: 'address line 2',
    town: 'town',
    postcode: 'postcode',
    country: 'country',
    password: 'password',
    status: 'status',
    invitationCode: 'invitation code'
  };

  it('activate', function test(done) {

    signUp.handler({ body: JSON.stringify(member) }, {}).then(function (response) {
      expect(response.statusCode).to.equal(200);
      const activationCode = emailer.activationCode;
      console.log(activationCode);
      activateMember.handler({ body: activationCode }, {}).then(function (response) {
        const token = response.body;
        expect(response.statusCode).to.equal(200);
        expect(token).exist;
        done();
      });
    });
  });

});
const request = require('supertest');
const expect = require('chai').expect;
const uuid = require('uuid/v1');
const moment = require('moment');
const signUp = require('../../../src/api/sign-up');
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
      let savedMember = JSON.parse(response.body);
      activateMember.handler({ body: savedMember.activationCode }, {}).then(function (response) {
        const token = response.body;
        expect(token).exist;
        done();
      });
    });
  });

});
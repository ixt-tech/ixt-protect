const request = require('supertest');
const expect = require('chai').expect;
const uuid = require('uuid/v1');
const moment = require('moment');
const signUp = require('../../../src/api/sign-up');
const updateMember = require('../../../src/api/update-member');

describe('updateMember', function test() {

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

  it('update', function test(done) {

    signUp.handler({ body: JSON.stringify(member) }, {}).then(function (response) {
      let savedMember = JSON.parse(response.body);
      savedMember.firstName = uuid();
      updateMember.handler({ body: JSON.stringify(savedMember) }, {}).then(function (response) {
        const updatedMember = JSON.parse(response.body);
        expect(updatedMember.firstName).to.equal(savedMember.firstName);
        done();
      });
    });
  });

});
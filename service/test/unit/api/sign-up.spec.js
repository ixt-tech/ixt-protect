const request = require('supertest');
const expect = require('chai').expect;
const uuid = require('uuid/v1');
const moment = require('moment');
const signUp = require('../../../src/api/sign-up');
const config = require('../../../src/common/config');

describe('signUp', function test() {

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

  it('creates new record', function test(done) {
    const event = {
      body: JSON.stringify(member)
    }
    signUp.handler(event, {}).then(function (response) {
      const savedMember = JSON.parse(response.body);
      expect(savedMember.id).exist;
      expect(savedMember.firstName).to.equal(member.firstName);
      expect(savedMember.lastName).to.equal(member.lastName);
      expect(savedMember.email).to.equal(member.email);
      expect(savedMember.telephone).to.equal(member.telephone);
      expect(savedMember.addressLine1).to.equal(member.addressLine1);
      expect(savedMember.addressLine2).to.equal(member.addressLine2);
      expect(savedMember.town).to.equal(member.town);
      expect(savedMember.postcode).to.equal(member.postcode);
      expect(savedMember.country).to.equal(member.country);
      expect(savedMember.status).to.equal(member.status);
      expect(savedMember.invitationCode).to.equal(member.invitationCode);
      done();
    });
  });

});
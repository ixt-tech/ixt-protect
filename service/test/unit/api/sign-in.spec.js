const request = require('supertest');
const expect = require('chai').expect;
const uuid = require('uuid/v1');
const moment = require('moment');
const signUp = require('../../../src/api/verify-email');
const activateMember = require('../../../src/api/activate');
const signIn = require('../../../src/api/sign-in');
const getMember = require('../../../src/api/get-member');

describe('signIn', function test() {

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

  it('signs in', function test(done) {

    // create new member
    signUp.handler({ body: JSON.stringify(member) }, {}).then(function (response) {
      let savedMember = JSON.parse(response.body);
      // replace by activation code retrieve

      // activate member
      activateMember.handler({ body: savedMember.activationCode }, {}).then(function (response) {

        //sign in to get a token
        const credentials = {email: member.email, password: member.password};
        signIn.handler({ body: JSON.stringify(credentials) }, {}).then(function (response) {
          const encryptedToken = JSON.parse(response.body).token;
          // call a secured endpoint
          const headers = {};
          headers['x-access-token'] = encryptedToken;

          getMember.handler({ headers: headers }, {}).then(function(response) {
            expect(savedMember.id).to.equal(JSON.parse(response.body).id);
            done();
          });

        });
      });
    });
  });

  it('fails sign in', function test(done) {

    const invalidEmail = 'invalid';
    const credentials = {email: invalidEmail, password: member.password};

    //sign in to get a token
    signIn.handler({ body: JSON.stringify(credentials) }, {}).then(function (r) {
      const response = JSON.parse(r.body);
      expect(response.message).to.equal('Sign in failed');
      expect(r.statusCode).to.equal(403);
      done();
    });

  });

  it('fails sign in', function test(done) {

    const invalidPassword = 'invalid';
    const credentials = {email: member.email, password: invalidPassword};

    //sign in to get a token
    signIn.handler({ body: JSON.stringify(credentials) }, {}).then(function (r) {
      const response = JSON.parse(r.body);
      expect(response.message).to.equal('Sign in failed');
      expect(r.statusCode).to.equal(403);
      done();
    });

  });

});
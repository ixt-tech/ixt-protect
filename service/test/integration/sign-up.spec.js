const request = require('supertest');
const expect = require('chai').expect;
const getSlsOfflinePort = require('./getSlsOfflinePort');

describe('signUp', function test() {

  let signUp = {
    firstName: 'first name',
    lastName: 'last name',
    email: 'email',
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

  it('ok', function it(done) {
    request(`http://localhost:${getSlsOfflinePort()}`)
      .post(`/sign-ups`)
      .send(signUp)
      .expect(200)
      .end(function (error, result) {
        if (error) {
          return done(error);
        }
        const savedSignUp = result.body;
        expect(savedSignUp.id).exist;
        expect(savedSignUp.firstName).to.equal(signUp.firstName);
        expect(savedSignUp.lastName).to.equal(signUp.lastName);
        expect(savedSignUp.email).to.equal(signUp.email);
        expect(savedSignUp.telephone).to.equal(signUp.telephone);
        expect(savedSignUp.addressLine1).to.equal(signUp.addressLine1);
        expect(savedSignUp.addressLine2).to.equal(signUp.addressLine2);
        expect(savedSignUp.town).to.equal(signUp.town);
        expect(savedSignUp.postcode).to.equal(signUp.postcode);
        expect(savedSignUp.country).to.equal(signUp.country);
        expect(savedSignUp.status).to.equal(signUp.status);
        expect(savedSignUp.invitationCode).to.equal(signUp.invitationCode);
        done();
      });
  });

});
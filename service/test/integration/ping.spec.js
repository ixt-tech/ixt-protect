const request = require('supertest');
const expect = require('chai').expect;
const getSlsOfflinePort = require('./getSlsOfflinePort');

describe('ping', function getPingTest() {

  it('ok', function it(done) {
    request(`http://localhost:${getSlsOfflinePort()}`)
      .get(`/ping`)
      .expect(200)
      .end(function (error, result) {
        if (error) {
          return done(error);
        }
        done();
      });
  });

});
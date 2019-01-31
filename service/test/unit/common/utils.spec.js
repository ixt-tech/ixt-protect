'use strict';

const expect = require('chai').expect;
const utils = require('../../../src/common/utils');

describe('utils', function test() {

  it('should jwt', function test(done) {
    const payload = 'test-payload';
    const token = utils.createJwt(payload);
    const result = utils.decryptJwt(token);
    expect(result).to.equal(payload);
    done();
  });

})
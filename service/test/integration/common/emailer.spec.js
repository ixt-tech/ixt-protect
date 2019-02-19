const chai = require('chai');
const path = require('path');

const Emailer = require('../../../src/common/emailer');
const emailer = new Emailer();

require('dotenv').config({path: path.join(__dirname, '/') + '.env'});

describe('Emailer', function() {
/*
  it('should send an email', function(done) {

    let mailOptions = {
      from: '"dev team" <noreply@ixt.global>',
      to: 'ingemar.svensson@ixt.global',
      subject: 'Test email from the Dev team'
    };
    emailer.send(mailOptions);
    done();

  });
*/

  it('should send an email with template', function(done) {

    let mailOptions = {
      from: '"dev team" <noreply@ixt.global>',
      to: 'ingemar.svensson@ixt.global',
      subject: 'Test email with template from the Dev team',
      templatePath: path.resolve(__dirname, '../../../','template','email'),
      locals: {
        activationCode: '123ABC'
      }
    };
    emailer.send(mailOptions, 'email-verification');
    done();

  });

  /*
  it('should send email verification', function(done) {

    const member = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'ingemar.svensson@ixt.global',
      activationCode: '123ABC'
    }
    emailer.sendEmailVerification(member);
    done();

  });
*/
});
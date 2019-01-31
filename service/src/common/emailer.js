'use strict';

const path = require('path');
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates');
require('dotenv').config({path: path.join(__dirname, '/') + '.env'});

let transporter;

class Emailer {

  constructor() {
    this.configuration = {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_AUTH_USER,
        pass: process.env.EMAIL_AUTH_PASS
      }
    };

    transporter = nodemailer.createTransport(this.configuration);
  }

  sendEmailVerification(member) {
    const mailOptions = {
      from: '"IXT Global" <noreply@ixt.global>',
      to: member.email,
      subject: 'Verify your email address',
      templatePath: path.resolve(__dirname, '../../../test','template','email'),
      vars: {
        member: member,
        baseUrl: process.env.BASE_URL + '/activations'
      },
      send: true
    };
    this.send(mailOptions, 'email-verification');
  }

  send(mailOptions) {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) return reject(error);
        return resolve(info);
      });
    });
  }

  send(mailOptions, template) {
    const templatePath = mailOptions.templatePath
      ? mailOptions.templatePath : path.resolve(__dirname, '../../','template','email');
    const emailTemplate = new EmailTemplate({
      views: { root: templatePath },
      transport: transporter,
      message: {
        from: mailOptions.from,
        to: mailOptions.to,
        bcc: mailOptions.bcc,
        subject: mailOptions.subject
      },
      send: true
    });
    return emailTemplate.send({
      template: template,
      locals: mailOptions.vars
    }).then(r => r).catch(console.log);
  }

}

module.exports = Emailer;

'use strict';

const path = require('path');
const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates');
require('dotenv').config({path: path.join(__dirname, '/') + '.env'});

let transporter;

/**
 * GMAIL set up:
 * - Needs to have an app password defined on account
 * - Needs to have enabled access by less secured apps
 */
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
    const activationCode = member.activationCode;
    const mailOptions = {
      from: '"IXT Global" <noreply@ixt.global>',
      to: member.email,
      subject: 'Verify your email address',
      templatePath: path.resolve(__dirname, '../../','template','email'),
      vars: {
        activationCode: activationCode
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

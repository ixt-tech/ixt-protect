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

  async sendEmailVerification(member) {

    console.log('Sending email verification email to ' + member.email)

    const mailOptions = {
      to: member.email,
      subject: 'Verify your IXT Protect email',
      locals: {
        activationCode: member.activationCode
      }
    };
    await this.send(mailOptions, 'email-verification');

    console.log('Email sent');

  }

  async sendMembershipStarted(member) {

    console.log('Sending membership started email to ' + member.email)

    const mailOptions = {
      to: member.email,
      subject: 'Welcome to IXT Protect',
      locals: {
      }
    };
    await this.send(mailOptions, 'membership-started');

    console.log('Email sent');

  }

  async sendNewRedemption(member, redemption) {

    console.log('Sending new redemption email to ' + member.email)

    const mailOptions = {
      to: member.email,
      subject: 'You redeemed some IXT',
      locals: {
        ixtAmount: redemption.ixtAmount,
        redemptionDescription: redemption.description
      }
    };
    await this.send(mailOptions, 'new-redemption');

    console.log('Email sent');

  }

  async sendNewReward(member, reward) {

    console.log('Sending new reward email to ' + member.email)

    const mailOptions = {
      to: member.email,
      subject: 'You have been given an IXT Reward!',
      locals: {
        ixtAmount: reward.ixtAmount,
        rewardDescription: reward.description
      }
    };
    await this.send(mailOptions, 'new-reward');

    console.log('Email sent');

  }

  async sendResetPassword(member) {

    console.log('Sending reset password email to ' + member.email)

    const mailOptions = {
      to: member.email,
      subject: 'Reset your IXT Protect password',
      locals: {
      }
    };
    await this.send(mailOptions, 'reset-password');

    console.log('Email sent');

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
        from: '"IXT Global" <noreply@ixt.global>',
        to: mailOptions.to,
        bcc: mailOptions.bcc,
        subject: mailOptions.subject
      },
      send: true
    });
    return emailTemplate.send({
      template: template,
      locals: mailOptions.locals
    }).then(r => r).catch(console.log);

  }

}

module.exports = Emailer;

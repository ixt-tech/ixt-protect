'use strict';

const query = require('../common/db');
const utils = require('../common/utils');
const moment = require('moment');
const uuid = require('uuid/v1');
const Emailer = require('../common/emailer');
const Stripe = require("stripe");

class MemberService {

  constructor() {
    this.emailer = new Emailer();
  }

  async verifyEmail(credentials) {

    console.log('Verifying email begins...');

    const existingMember = await this.getMemberByEmail(credentials.email);
    if(existingMember) throw { code: 409, message: 'This email is already signed up' };

    credentials.id = undefined;
    credentials.activationCode = Math.floor(Math.random() * (999999 - 100000 + 1) ) + 100000;
    credentials.salt = utils.generateSalt(16);
    credentials.invitationCode = utils.generateSalt(8);
    credentials.password = utils.hashPassword(credentials.salt + credentials.password);
    credentials.status = 'NEW';
    await this.emailer.sendEmailVerification(credentials);

    this._setTraceInfo(credentials);
    await query('insert into member (' +
      'email, ' +
      'password, ' +
      'salt, ' +
      'createdAt, ' +
      'activationCode, ' +
      'invitationCode, ' +
      'referralCode, ' +
      'status) ' +
      'values(?, ?, ?, ?, ?, ?, ?, ?)', [
      credentials.email,
      credentials.password,
      credentials.salt,
      utils.toSqlTimestamp(credentials.createdAt),
      credentials.activationCode,
      credentials.invitationCode,
      credentials.referralCode,
      credentials.status]
    );

    console.log('Verifying email completed.');

  }

  async activate(activationCode) {

    console.log('Activation begins...');

    const inactiveMember = await this.getMemberByActivationCode(activationCode);
    if(!inactiveMember) throw { code: 401, message: 'Invalid activation code' };
    inactiveMember.status = 'VERIFIED';
    const activeMember = await this.updateMember(inactiveMember);
    const accessToken = await this._createSession(activeMember);

    console.log('Activation completed.');

    return {
      accessToken: accessToken,
      account: activeMember
    };

  }

  async signIn(email, password) {

    console.log('Sign in [' + email + '] begins...');

    const member = await this.getMemberByEmail(email);
    if(member &&
       member.password === utils.hashPassword(member.salt + password) &&
      (member.status == 'NEW' || member.status == 'VERIFIED' || member.status == 'ACTIVE')) {
      const session = await this._createSession(member);

      console.log('Sign in completed.');

      return session;

    } else {

      console.error('An error occurred during sign in');
      throw { code: 403, message: 'Sign in failed' };
    }

  }

  async signOut(id) {

    console.log('Sign out begins...');

    this._setTraceInfo(member);
    const sql = 'update member set ' +
      'sessionStatus = ? ' +
      'where id = ' + id;
    const params = [
      'EXPIRED'
    ]
    await query(sql, params);

    console.log('Sign out completed.');

  }

  async isSessionActive(id) {

    console.log('Is session active begins...');

    let sql = 'select ' +
      'sessionStatus ' +
      'from member where id = ?';
    const result = await query(sql, [id]);
    let isSessionActive = false;
    if(result.length > 0) {
      isSessionActive = result[0].sessionStatus == 'ACTIVE';
    }

    console.log('Is session active completed.');

    return isSessionActive;

  }

  async updatePassword(memberId, newPassword, oldPassword) {

    console.log('Update password begins...');

    let member = await this.getMemberById(memberId);

    const salt = member.salt;
    const oldPasswordHash = utils.hashPassword(salt + oldPassword);
    const newPasswordHash = utils.hashPassword(salt + newPassword);
    if(member.password === oldPasswordHash) {
      await query('update member set password = ? where id = ' + memberId, [newPasswordHash])
    } else {
      throw { code: 403, message: 'Incorrect credentials.' };
    }

    console.log('Update password completed.');

  }

  async getMember(whereClause, params) {

    console.log('Get member begins...');

    let sql = 'select ' +
      'id, ' +
      'firstName, ' +
      'lastName, ' +
      'dateOfBirth, ' +
      'email, ' +
      'telephone, ' +
      'addressLine1, ' +
      'addressLine2, ' +
      'town, ' +
      'postcode, ' +
      'country, ' +
      'status, ' +
      'createdAt, ' +
      'updatedAt, ' +
      'lastSignedIn, ' +
      'invitationCode, ' +
      'salt, ' +
      'password ' +
      'from member' + (whereClause ? ' ' + whereClause : '');

    const result = await query(sql, params);

    console.log('Get member completed.');

    return result;

  }

  async updateMember(member) {

    console.log('Update member begins...');

    const existingMember = await this.getMemberByEmail(member.email);
    if(existingMember.id != member.id) throw { code: 409, message: 'This email is already signed up' };
    this._setTraceInfo(member);
    const sql = 'update member set ' +
      'firstName = ?, ' +
      'lastName = ?, ' +
      'dateOfBirth = ?, ' +
      'email = ?, ' +
      'telephone = ?, ' +
      'addressLine1 = ?, ' +
      'addressLine2 = ?, ' +
      'town = ?, ' +
      'postcode = ?, ' +
      'country = ?, ' +
      'status = ?, ' +
      'createdAt = ?, ' +
      'updatedAt = ?, ' +
      'lastSignedIn = ? ' +
      'where id = ' + member.id;
    const params = [
      member.firstName,
      member.lastName,
      utils.toSqlDate(member.dateOfBirth),
      member.email,
      member.telephone,
      member.addressLine1,
      member.addressLine2,
      member.town,
      member.postcode,
      member.country,
      member.status,
      utils.toSqlTimestamp(member.createdAt),
      utils.toSqlTimestamp(member.updatedAt),
      utils.toSqlTimestamp(member.lastSignedIn)
    ]
    await query(sql, params);

    console.log('Update member completed.');

    return member;

  }

  async checkout(member, token) {

    console.log('Checkout begins...');

    const stripe = new Stripe("sk_test_Zg9e2fvHXeTEr32dvBfRbNBc");
    (async () => {
      const charge = await stripe.charges.create({
        amount: 5900.00,
        currency: 'usd',
        description: 'IXT Protect',
        source: token,
        statement_descriptor: 'IXT Protect membership',
      });
    })();

    member.status = 'ACTIVE';
    let result = await query('select referralCode from member where id = ' + member.id);
    let referralCode = undefined;
    if(result.length > 0) {
      referralCode = result[0].referralCode;
      result = await this.getMember('where invitationCode = ?', [referralCode]);
      if(result.length > 0) {
        const inviter = result[0];
        await this.createReward(
          inviter,
          {
            referralCode: referralCode,
            amount: 200,
            receiver: inviter.id,
            type: 'INVITATION_REWARD',
            description: 'Invitation reward for inviting member ' + member.firstName + ' ' + member.lastName,
          }
        );
      }
    }
    const updateResult = await this.updateMember(member);
    this.emailer.sendMembershipStarted(member);

    console.log('Checkout completed.');
    return updateResult;

  }

  deleteMember(id) {

    console.log('Delete member begins...');
    const result = query('delete from member where ?', [ id ]);
    console.log('Delete member completed.');

  }

  async getMemberByEmail(email) {

    console.log('Get member by email begins...');

    const result = await this.getMember('where email = ?', [ email ]);
    let member = undefined;
    if(result.length > 0) {
      member = result[0];
    }

    console.log('Get member by email completed.');
    return member;

  }

  async getMemberById(id) {

    console.log('Get member by id begins...');

    const result = await this.getMember('where id = ?', [ id ]);
    let member = undefined;
    if(result.length > 0) {
      member = result[0];
    }

    console.log('Get member by id completed.');
    return member;

  }

  async getMemberByActivationCode(activationCode) {

    console.log('Get member by activation code begins...');

    const result = await this.getMember('where activationCode = ?', [activationCode]);
    let member = undefined;
    if(result.length > 0) {
      member = result[0];
    }

    console.log('Get member by activation code completed.')
    return member;

  }

  async createReward(member, reward) {

    console.log('Create reward begins...');

    reward.id = undefined;
    await this.emailer.sendNewReward(member, reward);

    this._setTraceInfo(reward);
    await query('insert into reward (' +
      'referralCode, ' +
      'amount, ' +
      'receiver, ' +
      'type, ' +
      'description, ' +
      'createdAt, ' +
      'updatedAt) ' +
      'values(?, ?, ?, ?, ?, ?, ?)', [
      reward.referralCode,
      reward.amount,
      reward.receiver,
      reward.type,
      reward.description,
      utils.toSqlTimestamp(reward.createdAt),
      utils.toSqlTimestamp(reward.updatedAt),
      ]
    );

    console.log('Create reward completed.');

  }

  async getRewards(id) {

    console.log('Get rewards begins...');

    let sql = 'select * from reward where receiver = ?';

    const result = await query(sql, [id]);

    console.log('Get rewards completed.');
    return result;

  }

  async getRewardBalance(memberId) {

    console.log('Get reward balance begins...');

    let sql = 'select sum(amount) as total from reward where receiver = ?';
    let result = await query(sql, [memberId]);
    const rewardTotal = result[0].total;

    sql = 'select sum(amount) as total from redemption where redeemer = ?';
    result = await query(sql, [memberId]);
    const redemptionTotal = result[0].total;

    const balance = rewardTotal - redemptionTotal;

    console.log('Get reward balance completed [' + balance + ']');
    return balance;

  }

  async redeem(memberId, redemption) {

    console.log('Redeem begins...');

    // check if enough balance
    const balance = await this.getRewardBalance(memberId);

    // find voucher
    let sql = 'select * from voucher where name = ? and country = ? and status = \'NEW\'';
    let result = await query(sql, [redemption.name, redemption.country]);
    if(!result || result.length == 0) {
      throw { code: 401, message: 'Invalid voucher name' };
    }
    const voucher = result[0];

    if(balance < voucher.amountIxt) {
      throw { code: 401, message: 'Insufficient reward balance' };
    }

    // create redemption
    redemption.id = undefined;

    this._setTraceInfo(redemption);
    await query('insert into redemption (' +
      'name, ' +
      'code, ' +
      'amount, ' +
      'redeemer, ' +
      'createdAt, ' +
      'updatedAt) ' +
      'values(?, ?, ?, ?, ?, ?)', [
        voucher.name,
        voucher.code,
        voucher.amountIxt,
        memberId,
        utils.toSqlTimestamp(redemption.createdAt),
        utils.toSqlTimestamp(redemption.updatedAt),
      ]
    );

    // send email
    const member = await this.getMemberById(memberId);
    this.emailer.sendNewRedemption(member, redemption);

    console.log('Redeem completed.');

  }

  async _createSession(member) {

    let session = {
      sessionId: uuid(),
      ttl: moment().add(process.env.SESSION_DURATION_AMOUNT, process.env.SESSION_DURATION_UNIT).valueOf(),
      memberId: member.id,
      email: member.email
    };

    member.lastSignIn = moment();
    member.sessionStatus = 'ACTIVE';
    this._setTraceInfo(member);
    const sql = 'update member set ' +
      'sessionStatus = ?, ' +
      'lastSignedIn = ? ' +
      'where id = ' + member.id;
    const params = [
      member.sessionStatus,
      utils.toSqlTimestamp(member.lastSignedIn)
    ]
    await query(sql, params);
    return utils.createJwt(session);

  }

  _setTraceInfo(record) {

    if(!record.id) {
      record.createdAt = moment.utc();
    }
    record.updatedAt = moment.utc();
  }

}

module.exports = MemberService;

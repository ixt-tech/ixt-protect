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

  }

  async activate(activationCode) {

    const inactiveMember = await this.getMemberByActivationCode(activationCode);
    if(!inactiveMember) throw { code: 401, message: 'Invalid activation code' };
    inactiveMember.status = 'VERIFIED';
    const activeMember = await this.updateMember(inactiveMember);
    const accessToken = await this.createSession(activeMember);
    return {
      accessToken: accessToken,
      account: activeMember
    };

  }

  async signIn(email, password) {

    const member = await this.getMemberByEmail(email);
    if(member &&
       member.password === utils.hashPassword(member.salt + password) &&
       member.status == 'ACTIVE') {

      const session = await this.createSession(member);
      return session;

    } else {
      throw { code: 403, message: 'Sign in failed' };
    }

  }

  async createSession(member) {

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

  async signOut(id) {

    this._setTraceInfo(member);
    const sql = 'update member set ' +
      'sessionStatus = ? ' +
      'where id = ' + id;
    const params = [
      'EXPIRED'
    ]
    await query(sql, params);

  }

  async isSessionActive(id) {

    let sql = 'select ' +
      'sessionStatus ' +
      'from member where id = ?';
    const result = await query(sql, [id]);
    return result[0].sessionStatus == 'ACTIVE';

  }

  async updatePassword(memberId, newPassword, oldPassword) {

    let member = await this.getMemberById(memberId);

    const salt = member.salt;
    const oldPasswordHash = utils.hashPassword(salt + oldPassword);
    const newPasswordHash = utils.hashPassword(salt + newPassword);
    if(member.password === oldPasswordHash) {
      await query('update member set password = ? where id = ' + memberId, [newPasswordHash])
    } else {
      throw { code: 403, message: 'Incorrect credentials.' };
    }

  }

  async getMember(whereClause, params) {

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
    return await query(sql, params);

  }

  async updateMember(member) {

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
    return member;

  }

  async checkout(member, token) {

    const stripe = new Stripe("sk_test_Zg9e2fvHXeTEr32dvBfRbNBc");
    (async () => {
      const charge = await stripe.charges.create({
        amount: 3900.00,
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
      result = await query('select id from member where invitationCode = ?', [referralCode]);
      if(result.length > 0) {
        const inviterId = result[0].id;
        this.createReward({
          referralCode: referralCode,
          amount: 20,
          receiver: inviterId,
          type: 'INVITATION_REWARD',
          description: 'Invitation reward for inviting member ' + member.firstName + ' ' + member.lastName,
        });
      }
    }
    return await this.updateMember(member);

  }

  deleteMember(id) {
    return query('delete from member where ?', [ id ]);
  }

  async getMemberByEmail(email) {

    const result = await this.getMember('where email = ?', [ email ]);
    if(result.length > 0) {
      return result[0];
    } else {
      return undefined;
    }

  }

  async getMemberById(id) {

    const result = await this.getMember('where id = ?', [ id ]);
    if(result.length > 0) {
      return result[0];
    } else {
      return undefined;
    }

  }

  async getMemberByActivationCode(activationCode) {

    const result = await this.getMember('where activationCode = ?', [activationCode]);
    if(result.length > 0) {
      return result[0];
    } else {
      return undefined;
    }

  }

  async createReward(reward) {

    reward.id = undefined;
    //await this.emailer.sendRewardEmail(reward);

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

  }

  async getRewards(id) {

    let sql = 'select * from reward where receiver = ?';
    return await query(sql, [id]);

  }

  _setTraceInfo(record) {

    if(!record.id) {
      record.createdAt = moment.utc();
    }
    record.updatedAt = moment.utc();
  }

}

module.exports = MemberService;

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
      'status) ' +
      'values(?, ?, ?, ?, ?, ?, ?)', [
      credentials.email,
      credentials.password,
      credentials.salt,
      utils.toSqlTimestamp(credentials.createdAt),
      credentials.activationCode,
      credentials.invitationCode,
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

  async authenticate(email, password) {

    const member = await this.getMemberByEmail(email);
    if(member &&
       member.password === utils.hashPassword(member.salt ? (member.salt + password) : password) &&
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
    await this.updateMember(member);
    return utils.createJwt(session);

  }

  async updatePassword(memberId, newPassword, oldPassword) {

    let member = await this.getMemberById(memberId);

    const salt = member.salt;
    const oldPasswordHash = utils.hashPassword(salt ? (salt + oldPassword) : oldPassword);
    const newPasswordHash = utils.hashPassword(salt ? (salt + newPassword) : newPassword);
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
      'salt, ' +
      'password ' +
      'from member' + (whereClause ? ' ' + whereClause : '');
    const result = await query(sql, params);
    return result;

  }

  async updateMember(member) {

    const existingMember = await this.getMemberByEmail(member.email);
    if(existingMember.id != member.id) throw { message: 'This email is already signed up' };
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
      'lastSignedIn = ?, ' +
      'invitationCode = ? ' +
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
      utils.toSqlTimestamp(member.lastSignedIn),
      member.invitationCode
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
    return await this.updateMember(member);

  }

  deleteMember(id) {
    return query('delete from member where ?', [ id ]);
  }

  async getMemberByEmail(email) {
    const result = await this.getMember('where email = ?', [ email ]);
    if(result && result[0].length > 0) {
      return result[0][0];
    } else {
      return undefined;
    }

  }

  async getMemberById(id) {

    const result = await this.getMember('where id = ?', [ id ]);
    if(result && result[0].length > 0) {
      return result[0][0];
    } else {
      return undefined;
    }

  }

  async getMemberByActivationCode(activationCode) {
    const result = await this.getMember('where activationCode = ?', [activationCode]);
    if(result && result[0].length > 0) {
      return result[0][0];
    } else {
      return undefined;
    }

  }

  _setTraceInfo(record) {

    if(!record.id) {
      record.createdAt = moment.utc();
    }
    record.updatedAt = moment.utc();
  }

}

module.exports = MemberService;

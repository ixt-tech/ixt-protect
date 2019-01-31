'use strict';

const query = require('../common/db');
const utils = require('../common/utils');
const moment = require('moment');
const uuid = require('uuid/v1');
const Emailer = require('../common/emailer');
const emailer = new Emailer();

class MemberService {

  constructor(emailer) {
    if(emailer) {
      this.emailer = emailer;
    }
  }

  async createMember(member) {
    const existingMember = await this.getMemberByEmail(member.email);
    if(existingMember) throw { code: 409, message: 'This email is already signed up' };
    member.activationCode = uuid();

    //this.emailer.sendEmailVerification(member);

    // Replace password with hash
    member.salt = utils.generateSalt(16);
    member.password = utils.hashPassword(member.salt + member.password);
    this._setTraceInfo(member);
    await query('insert into member (' +
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
      'password, ' +
      'salt, ' +
      'status, ' +
      'createdAt, ' +
      'updatedAt, ' +
      'activationCode, ' +
      'invitationCode) ' +
      'values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
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
      member.password,
      member.salt,
      'NEW',
      utils.toSqlTimestamp(member.createdAt),
      utils.toSqlTimestamp(member.updatedAt),
      member.activationCode,
      member.invitationCode]
    );
    const res = await query('select last_insert_id() as id from member');
    member.id = res[0][0].id;
    return member;

  }

  async activateMember(activationCode) {

    let result = await query('select * from member where activationCode=\'' + activationCode + '\'');
    if(result[0].length > 0) {
      const member = result[0][0];
      member.status = 'ACTIVE';
      await this.updateMember(member);
      const session = await this.createSession(member);
      return session;
    } else {
      throw { code: 403, message: 'Invalid activation code' };
    }

  }

  async authenticate(email, password) {

    const member = await this.getMemberByEmail(email);
    if(
      member &&
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

  async updateMemberPassword(memberId, newPassword, oldPassword) {

    let member = await this.getMemberById(memberId);

    const salt = user.salt;
    const oldPasswordHash = utils.hashPassword(salt ? (salt + oldPassword) : oldPassword);
    const newPasswordHash = utils.hashPassword(salt ? (salt + newPassword) : newPassword);

    if(member.password === oldPasswordHash) {
      await query('update member set password = ? where id = ' + memberId, [newPasswordHash])
    } else {
      throw { code: 403, message: 'Incorrect credentials.' };
    }

  }

  async getMember(whereClause, params) {

    let sql = 'select * from member' + (whereClause ? ' ' + whereClause : '');
    return await query(sql, params);

  }

  async updateMember(member) {
    const existingMember = await this.getMemberByEmail(member.email);
    if(existingMember.id != member.id) throw { message: 'This email is already signed up' };
    this._setTraceInfo(member);
    await query('update member set ' +
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
      'where id = ' + member.id, [
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
    );

    return member;
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

  _setTraceInfo(record) {

    if(!record.id) {
      record.createdAt = moment.utc();
    }
    record.updatedAt = moment.utc();
  }

}

module.exports = MemberService;

'use strict';

const response = require('./response');
const query = require('../common/db');

module.exports.handler = async (event, context) => {

  const signUp = JSON.parse(event.body);
  try {
    await query('insert into application (' +
      '`firstName`, ' +
      '`lastName`, ' +
      '`dateOfBirth`, ' +
      '`email`, ' +
      '`telephone`, ' +
      '`addressLine1`, ' +
      '`addressLine2`, ' +
      '`town`, ' +
      '`postcode`, ' +
      '`country`, ' +
      '`password`, ' +
      '`status`, ' +
      '`createdAt`, ' +
      '`updatedAt`, ' +
      '`invitationCode`) ' +
      'values(?, ?, now(), ?, ?, ?, ?, ?, ?, ?, ?, ?, now(), now(), ?)', [
      signUp.firstName,
      signUp.lastName,
      signUp.email,
      signUp.telephone,
      signUp.addressLine1,
      signUp.addressLine2,
      signUp.town,
      signUp.postcode,
      signUp.country,
      signUp.password,
      signUp.status,
      signUp.invitationCode]
    );
    const res = await query('select last_insert_id() as id from application');
    signUp.id = res[0][0].id;

    return response.ok(signUp);
  } catch(error) {
    return response.error(signUp);
  }

};

'use strict';
const query = require('../common/db');
const response = require('./response');

module.exports.handler = async (event, context) => {

  const application = event;
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
      '`invitationCode`) ' +
      'values(?, ?, now(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      application.firstName,
      application.lastName,
      application.email,
      application.telephone,
      application.addressLine1,
      application.addressLine2,
      application.town,
      application.postcode,
      application.country,
      application.password,
      application.status,
      application.invitationCode]
      );
    const id = await query('select last_insert_id() from application');
    application.id = id;
    return response.ok(application);
  } catch(error) {
    return response.error(error);
  }

};
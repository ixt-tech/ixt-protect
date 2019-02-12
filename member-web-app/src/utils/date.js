'use strict'

import moment from 'moment';

const formatDate = (date) => {
  return moment(date).format('DD MMM YYYY');
}

const formatTimestamp = (date) => {
  return moment(date).format('DD MMM YYYY HH:mm');
}

export { formatDate, formatTimestamp };

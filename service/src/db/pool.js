const mysql = require('mysql2');
const config = require('./config');

const pool = mysql.createPool({
    connectionLimit: 1,
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    database: config.MYSQL_DATABASE,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    multipleStatements: true,
    connectTimeout: 2000
});

module.exports = getConnection = async () => {
  return pool.getConnection();
}

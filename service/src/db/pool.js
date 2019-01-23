const mysql = require('mysql2');
const config = require('./config');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    database: config.MYSQL_DATABASE,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    multipleStatements: false,
    connectTimeout: 5000
});

module.exports = getConnection = async () => {
  return await pool.getConnection();
}

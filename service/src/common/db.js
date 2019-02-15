const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: config.MYSQL_HOST,
    port: config.MYSQL_PORT,
    database: config.MYSQL_DATABASE,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    multipleStatements: false,
    connectTimeout: 5000
});

module.exports = getConnection = () => {
  return pool.getConnection();
}

module.exports = query = async (sql, params) => {
  let connection = undefined;
  try {
    connection = await getConnection();
    const result = await connection.query(sql, params);
    if(result && result.length > 0) {
      return result[0];
    } else {
      return [];
    }
  } catch(error) {
  	console.error(error);
  	connection.rollback();
  	if(error) {
      throw error;
    }
  } finally {
  	if(connection) {
      connection.release();
  	}
  }
}
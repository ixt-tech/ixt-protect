const config = {
    AWS_REGION: process.env.AWS_REGION || 'eu-west-1',
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    MYSQL_PORT: parseInt(process.env.MYSQL_PORT || '3306', 10),
    MYSQL_USER: process.env.MYSQL_USER || 'root',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'my-secret-pw',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'resttemp'
};

module.exports = config;
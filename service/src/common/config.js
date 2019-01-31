const config = {
    AWS_REGION: process.env.AWS_REGION || 'eu-west-1',
    MYSQL_HOST: process.env.MYSQL_HOST || 'ixt-protect.chmb9zz8x0yv.eu-west-2.rds.amazonaws.com',
    MYSQL_PORT: parseInt(process.env.MYSQL_PORT || '3306', 10),
    MYSQL_USER: process.env.MYSQL_USER || 'ixtprotect',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || '7fZD7msd',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'ixtprotect.uat'
};

module.exports = config;
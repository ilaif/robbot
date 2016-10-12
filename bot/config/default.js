'use strict';

var env = process.env;

module.exports = {
    name: 'Rob',
    botToken: env.BOT_TOKEN || '294935473:AAGnEMyz5xbJ5YPwIAXi11b3tvoHxxgxOHU',
    noRules: !!(env.NO_RULES || 0),
    db: {
        user: env.MYSQL_USER || 'root',
        password: env.MYSQL_PASSWORD || 'root',
        schema: env.MYSQL_SCHEMA || 'rob',
        forceSync: env.FORCE_SYNC || false,
        options: {
            host: env.MYSQL_HOST || '127.0.0.1',
            logging: false,//console.log,
            dialect: 'mysql',
            port: env.MYSQL_PORT || 3306,
            define: {
                timestamps: true
            }
        }
    },
    log: {
        src: true,
        level: env.LOG_LEVEL || 'info',
        console: {}
    }
};
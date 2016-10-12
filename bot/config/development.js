'use strict';

var env = process.env;

module.exports = {
    botToken: env.BOT_TOKEN || '299212113:AAFNKoFZ7HdVU8WoJMuccBl3rb6lXvdg-TM',
    database: {
        forceSync: env.FORCE_SYNC || true
    }
};
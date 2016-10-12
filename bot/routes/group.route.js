'use strict';

let Route = require('../models/route.model'),
    config = require('../config'),
    Command = require('../enums/Command');

class GameRoute extends Route {
    constructor(opts) {
        super(opts);

        this.on('new_chat_participant', (msg, match) => {
            return this.parseCommand(Command.NEW, {msg, match})
                .then(() => {
                    this.res.sendMessage(this.req.chatId, `Welcome to the group ${this.req.from.firstName}! My name is ${config.name}. I am a RoBot ;)\nPlease add me personally by searching for `)
                })
                .then(this.catch);
        });
    }
}

module.exports = (client) => {
    new GameRoute({client});
};
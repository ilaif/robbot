'use strict';

let Route = require('../models/route.model'),
    config = require('../config'),
    Sticker = require('../enums/Sticker'),
    Command = require('../enums/Command');

class GroupRoute extends Route {
    constructor(opts) {
        super(opts);

        this.onNewChatParticipant((msg, match) => {
            return this.parseCommand(Command.NEW, {msg, match})
                .then(() => {
                    let msg = `Welcome to the group ${this.req.newParticipant.firstName}! My name is ${config.name}. I am a RoBot ;)\nPlease add me personally by searching your contacts for @${this.getBotName()}, only after that you can play the game.\nTo initialize a new game type /new.`;
                    this.res.sendMessage(this.req.chatId, msg);
                    this.res.sendSticker(this.req.chatId, Sticker.MUSTACHE_WELCOME);
                })
                .then(this.catch);
        });

        this.onLeftChatParticipant((msg, match) => {
            return this.parseCommand(Command.NEW, {msg, match})
                .then(() => {
                    let msg = `${this.req.leftParticipant.firstName} left the group... That's so sad... JK! I don't fucking care...`;
                    this.res.sendMessage(this.req.chatId, msg);
                    this.res.sendSticker(this.req.chatId, Sticker.YEAH_RIGHT);
                })
                .then(this.catch);
        });
    }
}

module.exports = (client) => {
    new GroupRoute({client});
};
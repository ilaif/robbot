'use strict';

class RequestContext {

    constructor(msg, cmd, input) {

        this.chatId = msg.chat.id;
        this.cmd = cmd;
        this.input = input;

        this.from = {};
        if (msg.from) {
            this.from = {
                id: msg.from.id,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name
            };
        }

    }

}

module.exports = RequestContext;
'use strict';

class Message {

    constructor(msg, match) {

        this.chatId = msg.chat.id;

        if (match.length > 0) {
            this.text = match[1];
        }

    }

}

module.exports = Message;
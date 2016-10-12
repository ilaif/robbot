'use strict';

let logger = require('../libs/logger.lib');

class Request {

    constructor(props) {
        let msg = props.msg;

        this.game = props.game;
        this.player = props.player;
        this.players = props.players;
        this.chatId = msg.chatId;
        this.cmd = props.cmd;
        this.input = props.input;

        this.from = msg.from;
        this.newParticipant = msg.newParticipant;
        this.leftParticipant = msg.leftParticipant;

        logger.debug(this, 'logging request');
    }

    isGameActive() {
        return this.game && this.game.isActive();
    }

    isChat() {
        return !!this.chatId;
    }

    isUser() {
        return !!this.from.id;
    }

    isPlayerInGame() {
        let result = false;

        if (this.players && this.player) {
            let playerId = this.player.id;
            let players = this.players.filter(p => p.id === playerId && p.gamePlayer.isPlaying());
            return (players.length > 0);
        }

        return result;
    }

}

module.exports = Request;
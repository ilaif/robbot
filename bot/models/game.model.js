'use strict';

let utilsLib = require('../libs/utils.lib'),
    BaseModel = require('../models/base.model'),
    ModelEnum = require('../enums/Model'),
    GameStatus = require('../enums/GameStatus'),
    _ = require('lodash'),
    GameState = require('../enums/GameState');

class Game extends BaseModel {

    static getName() {
        return ModelEnum.GAME;
    }

    constructor(data) {

        super();

        if (data.status) {
            if (utilsLib.findKeyByValue(GameStatus, data.status))
                this.status = data.status;
            else
                throw new Error('Status not valid');
        } else {
            this.status = GameStatus.ACTIVE;
        }

        this.state = data.state || GameState.INIT;

        this.chatId = data.chatId;

        this.round = data.round || 0;
    }

    isActive() {
        return this.status === GameStatus.ACTIVE;
    }

}

module.exports = Game;
'use strict';

let BaseModel = require('../models/base.model'),
    ModelEnum = require('../enums/Model'),
    PlayerColor = require('../enums/PlayerColor'),
    GamePlayerStatus = require('../enums/GamePlayerStatus');

class GamePlayer extends BaseModel {

    static getName() {
        return ModelEnum.GAME_PLAYER;
    }

    constructor(data) {
        super();

        this.playerId = data.playerId;
        this.gameId = data.gameId;
        this.color = data.color || PlayerColor.BLACK;
        this.status = data.status || GamePlayerStatus.PLAYING;
    }

}

module.exports = GamePlayer;
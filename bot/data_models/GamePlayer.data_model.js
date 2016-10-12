'use strict';

var Model = require('../enums/Model');
var GamePlayerStatus = require('../enums/GamePlayerStatus');
var _ = require('lodash');
var PlayerColor = require('../enums/PlayerColor');

module.exports = (sequelize, DataTypes) => {
    var model = sequelize.define(Model.GAME_PLAYER, {
        color: {
            type: DataTypes.ENUM,
            values: _.values(PlayerColor),
            allowNull: false,
            defaultValue: PlayerColor.BLACK
        },
        status: {
            type: DataTypes.ENUM,
            values: _.values(GamePlayerStatus),
            allowNull: false,
            defaultValue: GamePlayerStatus.PLAYING
        }
    }, {
        instanceMethods: {
            isPlaying: function () {
                return this.status === GamePlayerStatus.PLAYING;
            }
        },
        classMethods: {
            associate: (models) => {
            }
        }
    });

    return model;
};
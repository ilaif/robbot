'use strict';

var Model = require('../enums/Model');
var GameStatus = require('../enums/GameStatus');
var _ = require('lodash');
var GameState = require('../enums/GameState');

module.exports = (sequelize, DataTypes) => {
    var model = sequelize.define(Model.GAME, {
        status: {
            type: DataTypes.ENUM,
            values: _.values(GameStatus),
            allowNull: false,
            defaultValue: GameStatus.ACTIVE
        },
        state: {
            type: DataTypes.ENUM,
            values: _.values(GameState),
            allowNull: false,
            defaultValue: GameState.INIT
        },
        round: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        instanceMethods: {
            isActive: function () {
                return this.status === GameStatus.ACTIVE;
            }
        },
        classMethods: {
            associate: (models) => {
                model.belongsTo(models.Group, {foreignKey: {allowNull: false}});
                model.belongsToMany(models.Player, {through: models.GamePlayer});
            }
        }
    });

    return model;
};
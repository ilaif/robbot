'use strict';

var Model = require('../enums/Model');
var _ = require('lodash');
var VoteState = require('../enums/VoteState');

module.exports = (sequelize, DataTypes) => {
    var model = sequelize.define(Model.VOTE_ROUND, {
        round: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        state: {
            type: DataTypes.ENUM,
            values: _.values(VoteState),
            allowNull: false,
            defaultValue: VoteState.ACTIVE
        }
    }, {
        classMethods: {
            associate: (models) => {
                model.belongsTo(models.Game);
                model.belongsTo(models.Player);
                model.hasMany(models.Vote);
            }
        }
    });

    return model;
};
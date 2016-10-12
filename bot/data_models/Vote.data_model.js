'use strict';

var Model = require('../enums/Model');
var VoteState = require('../enums/VoteState');

module.exports = (sequelize, DataTypes) => {
    var model = sequelize.define(Model.VOTE, {
        accepted: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: (models) => {
                model.belongsTo(models.VoteRound);
                model.belongsTo(models.Player);
            }
        }
    });

    return model;
};
'use strict';

var Model = require('../enums/Model');

module.exports = (sequelize, DataTypes) => {
    var model = sequelize.define(Model.PLAYER, {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Fucker'
        },
        telegramId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        }
    }, {
        instanceMethods: {
            fullName: function () {
                return this.firstName + ' ' + this.lastName;
            }
        },
        classMethods: {
            associate: (models) => {
                model.belongsToMany(models.Game, {through: models.GamePlayer});
            }
        }
    });

    return model;
};
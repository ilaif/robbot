'use strict';

var Model = require('../enums/Model');

module.exports = (sequelize, DataTypes) => {
    var model = sequelize.define(Model.GROUP, {

        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return model;
};
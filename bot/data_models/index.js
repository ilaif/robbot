'use strict';

var Sequelize = require('sequelize');
var config = require('../config');
var Model = require('../enums/Model');
var utils = require('../libs/utils.lib');
var dbConf = config.db;
var sequelize = new Sequelize(dbConf.schema, dbConf.user, dbConf.password, dbConf.options);

var db = {};

db.Group = sequelize.import(`${__dirname}/${Model.GROUP}.data_model`);
db.Game = sequelize.import(`${__dirname}/${Model.GAME}.data_model`);
db.Player = sequelize.import(`${__dirname}/${Model.PLAYER}.data_model`);
db.GamePlayer = sequelize.import(`${__dirname}/${Model.GAME_PLAYER}.data_model`);
db.VoteRound = sequelize.import(`${__dirname}/${Model.VOTE_ROUND}.data_model`);
db.Vote = sequelize.import(`${__dirname}/${Model.VOTE}.data_model`);

Object.keys(db).forEach(model => {
    if ('associate' in db[model]) {
        db[model].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
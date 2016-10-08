'use strict';

let utilsLib = require('../libs/utils.lib'),
    ModelEnum = require('../enums/Model'),
    BaseModel = require('../models/base.model');

class Player extends BaseModel {

    static getName() {
        return ModelEnum.PLAYER;
    }

    constructor(data) {

        super();

        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
    }

}

module.exports = Player;
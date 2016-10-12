'use strict';

let ModelEnum = require('../enums/Model');
let BaseModel = require('../models/base.model');

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
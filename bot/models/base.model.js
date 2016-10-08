'use strict';

let utilsLib = require('../libs/utils.lib');

class BaseModel {

    constructor() {

        this.id = utilsLib.generateGUID();

    }

}

module.exports = BaseModel;
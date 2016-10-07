'use strict';

exports.findKeyByValue = (enumObj, value) => _.invert(enumObj)[value];

exports.getEnumValues = (enumObj) => Object.keys(enumObj).map((k) => enumObj[k]);
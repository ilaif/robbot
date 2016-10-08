'use strict';

let _ = require('lodash');

exports.findKeyByValue = (enumObj, value) => _.invert(enumObj)[value];

exports.getEnumValues = (enumObj) => Object.keys(enumObj).map((k) => enumObj[k]);

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

exports.generateGUID = () => {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

exports.pickNRandomNumbersFromRange = (n, start, end) => {
    if (start > end) throw new Error('Start must be lower or equal to end');
    if (end - start < n) throw new Error('n must be less or equal from the range size');

    let results = new Set();
    while (results.size < n) {
        let num = Math.floor(Math.random() * end) + start;
        if (!results.has(num))
            results.add(num);
    }

    return Array.from(results);
};
'use strict';

function getPath(name) {
    return `${__dirname}/../assets/stickers/${name}.webp`;
}

module.exports = Object.freeze({
    YEAH_RIGHT: getPath('yeah_right'),
    MUSTACHE_WELCOME: getPath('mustache_welcome')
});
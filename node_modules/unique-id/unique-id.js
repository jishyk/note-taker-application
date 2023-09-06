'use strict';

const DEFAULT_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const DEFAULT_LENGTH = 8;

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function uniqueId(length = DEFAULT_LENGTH, charset = DEFAULT_CHARSET) {
    const max = charset.length - 1;
    let result = '';

    while (length > 0) {
        length -= 1;
        result += charset[randomInt(max)];
    }

    return result;
}

module.exports = uniqueId.default = uniqueId.uniqueId = uniqueId;

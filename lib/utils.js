const parseUrl = require('url').parse;
const formatUrl = require('url').format;
const crypto = require('crypto');

const randomString = (size, chars) => {
    size = size || 6;
    chars = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const max = chars.length;
    let ret = '';
    for (let i = 0; i < size; i++) {
        ret += chars.charAt(Math.floor(Math.random() * max));
    }
    return ret;
};

const addQueryParamsToUrl = (url, params) => {
    let info = parseUrl(url, true);
    for (let i in params) {
        info.query[i] = params[i];
    }
    delete info.search;
    return formatUrl(info);
};
// console.log(randomString(20));

// 如果数值不大于0则返回默认值
const defaultNumber = (n, d) => {
    n = Number(n);
    return n > 0 ? n : d;
};

const toBuffer = (data) => {
    if (Buffer.isBuffer(data)) return data;
    if (typeof data === 'string') return new Buffer(data);
    throw new Error('invalid data type, must be string or buffer');
};

/**
 * 32位MD5值
 */
const md5 = (text) => {
    return crypto.createHash('md5').update(toBuffer(text)).digest('hex');
};


module.exports = {randomString, addQueryParamsToUrl, defaultNumber};
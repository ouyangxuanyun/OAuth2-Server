const parseUrl = require('url').parse;
const formatUrl = require('url').format;

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

module.exports = {randomString, addQueryParamsToUrl};
const utils = require('./utils');
const errHandles = require('./errorHandle');
const dataAuthorizationCode = new Map();

const getAppInfo = (id) => {
  return new Promise((res, rej) => {
    res({
      id: id,
      name: 'Node.js实战',
      description: '专注Node.js实战二十年',
      secret: 'xffcncgmveu6slxg',
      redirectUri: 'http://127.0.0.1:3000/example/auth/callback'
    });
  });
};

// check if URL is valid
const verifyAppRedirectUri = (clientId, url) => {
  return getAppInfo(clientId).then(info => {
    if (!info) {
      return errHandles.invalidParameterError('client_id');
    }
    return info.redirectUri === url;
  }).catch(err => {
    throw err;
  });
};

// generate authorize code
const generateAuthorizationCode = (userId, clientId, redirectId) => {
  return new Promise((res, rej) => {
    let code = utils.randomString(20);
    dataAuthorizationCode.set(code, {clientId, userId});
    res(code);
  });
};


module.exports = {verifyAppRedirectUri, getAppInfo, generateAuthorizationCode};


const utils = require('./utils');
const errHandles = require('./errorhandle');
let dataAuthorizationCode = new Map();
let dataAccessToken = [];

const getAppInfo = (id) => {
    return new Promise((res, rej) => {
        res({
            id: id,
            name: '第三方APP',
            description: '某一个第三方APP',
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


// 生成access_token
const generateAccessToken = (userId, clientId) => {
    return new Promise((res, rej) => {
        let code = utils.randomString(20);
        dataAccessToken[code] = {
            clientId: clientId,
            userId: userId
        };
        res(code);
    })
};
// 查询access_token的信息
getAccessTokenInfo = (token) => {
    return new Promise((res, rej) => {
        let info = dataAccessToken[token];
        if (!info) return errHandles.invalidParameterError('token');
        res(info);
    })
};

// 验证授权码是否正确
const verifyAuthorizationCode = (code, clientId, clientSecret, redirectUri) => {
    let info = dataAuthorizationCode.get(code);
    if (!info) return errHandles.invalidParameterError('code');
    if (info.clientId !== clientId) return errHandles.invalidParameterError('code');
    getAppInfo(clientId)
        .then(appInfo => {
            if (appInfo.secret !== clientSecret) return errHandles.invalidParameterError('client_secret');
            if (appInfo.redirectUri !== redirectUri) return errHandles.invalidParameterError('redirect_uri');
            return info.userId;
        });
};

// 删除授权Code
const deleteAuthorizationCode = (code, callback) => {
    return new Promise((res, rej) => {
        dataAuthorizationCode.delete(code);
        res(code);
    });
};

module.exports = {
    verifyAppRedirectUri,
    getAppInfo,
    generateAuthorizationCode,
    verifyAuthorizationCode,
    generateAccessToken,
    getAccessTokenInfo,
    deleteAuthorizationCode
};
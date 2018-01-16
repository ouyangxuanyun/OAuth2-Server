const errHandles = require('./errorhandle');
const database = require('./database');
const path = require('path');
const parseUrl = require('url').parse;
const js2xmlparser = require('js2xmlparser');


const ensureLogin = (req, res, next) => {
    console.log('RRRRR');
    console.log(req.query);
    console.log(req.body);
    // 这里直接设置用户ID=glen
    req.loginUserId = 'Fu';
    next();
};

// 验证access_token
const verifyAccessToken = (req, res, next) => {
    let accessToken = (req.body && req.body.access_token) || req.query.access_token;
    let source = (req.body && req.body.source) || req.query.source;
    if (!accessToken) return next(errHandles.missingParameterError('access_token'));
    if (!source) return next(errHandles.missingParameterError('source'));

    database.getAccessTokenInfo(accessToken)
        .then(tokenInfo => {
            if (source !== tokenInfo.clientId) {
                return errHandles.invalidParameterError('source');
            }
            req.accessTokenInfo = tokenInfo;
            next();
        })
};

const extendAPIOutput = (req, res, next) => {
    // 输出数据
    function output(data) {
        // 取得请求的数据格式
        let type = path.extname(parseUrl(req.url).pathname);
        if (!type) type = '.' + req.accepts(['json', 'xml']);
        console.log(777,type)
        switch (type) {
            case '.xml':
                return res.xml(data);
            default:
                return res.json(data);
        }
    }

    // 响应API成功结果
    res.apiSuccess = function (data) {
        console.log(6666,data,JSON.stringify(data))
        output({
            status: 'OK',
            result: data
        });
    };

    // 响应API出错结果，err是一个Error对象，
    // 包含两个属性：error_code和error_message
    res.apiError = function (err) {
        output({
            status: 'Error',
            error_code: err.error_code || 'UNKNOWN',
            error_message: err.error_message || err.toString()
        });
    };

    // 输出XML格式数据
    res.xml = function (data) {
        res.setHeader('content-type', 'text/xml');
        res.end(js2xmlparser('data', data));
    };

    next();

}

module.exports = {ensureLogin, verifyAccessToken, extendAPIOutput}


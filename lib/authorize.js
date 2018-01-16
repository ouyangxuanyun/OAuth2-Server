const utils = require('./utils');
const errHandles = require('./errorhandle');
const database = require('./database');

const checkAuthorizeParams = (req, res, next) => {
    if (!req.query.client_id) {
      console.log('missingParameterError');
      return next(errHandles.missingParameterError('client_id'));
    }
    if (!req.query.redirect_uri) {
      console.log('missingParameterError');
      return next(errHandles.missingParameterError('redirect_uri'));
    }
    console.log(111111111)
    database.getAppInfo(req.query.client_id) // 获取第三方应用的详细信息并添加到req上给 showAppInfo 页面展示
        .then(ret => {
            console.log('&&&&&&&&&&', ret);
            req.appInfo = ret;
        })
        .then(res => {
            return database.verifyAppRedirectUri(req.query.client_id, req.query.redirect_uri);
        })
        .then(ok => {
            console.log('***********', ok);
            if (!ok) {
                return next(errHandles.redirectUriNotMatchError(req.query.redirect_uri));
            }
            next();
        });
};

// 确认显示授权页面
const showAppInfo = (req, res, next) => {
    res.locals.loginUserId = req.loginUserId; // 在 路由匹配第一步ensureLogin中设置成了fu
    res.locals.appInfo = req.appInfo; // 在 checkAuthorizeParams 函数中被设置成了{id,name,description,secret,redirectUri}
    res.render('authorize');
};

// 确认授权
const confirmApp = (req, res, next) => {
    console.log(333333333,req.loginUserId,req.query)
    database.generateAuthorizationCode(req.loginUserId, req.query.client_id, req.query.redirect_uri)
        .then(ret => {
            console.log(ret,'BBB',utils.addQueryParamsToUrl(req.query.redirect_uri, {
                code: ret}))
            res.redirect(utils.addQueryParamsToUrl(req.query.redirect_uri, {
                code: ret
            }));
        })
        .catch(err => {
            throw err;
        });
};

// 获取access_token
const getAccessToken = (req, res, next) => {
    // 检查参数
    console.log('**********检查参数',req.query,req.body)
    let client_id = req.body.client_id || req.query.client_id;
    let client_secret = req.body.client_secret || req.query.client_secret;
    let redirect_uri = req.body.redirect_uri || req.query.redirect_uri;
    let code = req.body.code || req.query.code;
    if (!client_id) return next(errHandles.missingParameterError('client_id'));
    if (!client_secret) return next(errHandles.missingParameterError('client_secret'));
    if (!redirect_uri) return next(errHandles.missingParameterError('redirect_uri'));
    if (!code) return next(errHandles.missingParameterError('code'));

    // 验证authorization_code
    database.verifyAuthorizationCode(code, client_id, client_secret, redirect_uri)
        .then(userId => {
            return database.generateAccessToken(userId, client_id) // 生成access_token
        })
        .then(accessToken => {
            database.deleteAuthorizationCode(code);// 生成access_token后需要删除旧的authorization_code

            console.log(989898)
            res.apiSuccess({
                access_token: accessToken,
                expires_in: 3600 * 24  // access_token的有效期为1天
            });
        })
        .catch(err => {
            // throw err;
            next(err);
        });
};
// let reqtest = {
//   query: {
//     client_id: 10,
//     redirect_uri: 'http://127.0.0.1:3000/example/auth/callback'
//   }
// };
// checkAuthorizeParams(reqtest, 'aaaa', (a, b) => {
//   console.log(a, b);
// });
module.exports = {checkAuthorizeParams, showAppInfo, confirmApp, getAccessToken};
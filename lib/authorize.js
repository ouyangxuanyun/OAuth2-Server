const utils = require('./utils');
const errHandles = require('./errorHandle');
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

  database.getAppInfo(req.query.client_id)
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

const showAppInfo = (req, res, next) => {
  res.locals.loginUserId = req.loginUserId;
  res.locals.appInfo = req.appInfo;
  res.render('authorize');
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
module.exports = {checkAuthorizeParams, showAppInfo};
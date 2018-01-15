const errHandles = require('./errorhandle')

exports.ensureLogin = function (req, res, next) {
  console.log('RRRRR');
  console.log(req.query);
  console.log(req.body);
  // 这里直接设置用户ID=glen
  req.loginUserId = 'fu';
  next();
};

// 获取access_token
const getAccessToken = (req,res,next) => {
  // 检查参数
  let client_id = req.body.client_id || req.query.client_id;
  let client_secret = req.body.client_secret || req.query.client_secret;
  let redirect_uri = req.body.redirect_uri || req.query.redirect_uri;
  let code = req.body.code || req.query.code;
  if (!client_id) return next(errHandles.missingParameterError('client_id'));
  if (!client_secret) return next(errHandles.missingParameterError('client_secret'));
  if (!redirect_uri) return next(errHandles.missingParameterError('redirect_uri'));
  if (!code) return next(errHandles.missingParameterError('code'));
}

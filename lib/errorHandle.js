const createApiError = (code, msg) => {
  let err = new Error(msg);
  err.error_code = code;
  err.error_message = msg;
  return err;
};

// 缺少参数错误
missingParameterError = function (name) {
  return createApiError('MISSING_PARAMETER', '缺少参数`' + name + '`');
};

// 回调地址不正确错误
redirectUriNotMatchError = function (url) {
  return createApiError('REDIRECT_URI_NOT_MATCH', '回调地址不正确：' + url);
};

// 参数错误
invalidParameterError = function (name) {
  return createApiError('INVALID_PARAMETER', '参数`' + name + '`不正确');
};

// 超出请求频率限制错误
outOfRateLimitError = function () {
  return createApiError('OUT_OF_RATE_LIMIT', '超出请求频率限制');
};

module.exports = {missingParameterError, redirectUriNotMatchError, invalidParameterError, outOfRateLimitError};

exports.ensureLogin = function (req, res, next) {
  // 这里直接设置用户ID=glen
  req.loginUserId = 'glen';
  next();
};


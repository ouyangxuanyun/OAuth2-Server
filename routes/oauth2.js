const express = require('express');
const router = express.Router();
const middlewares = require('../lib/middlewares');
const authorize = require('../lib/authorize');
const client = require('./client');

/* GET users listing. */
router.get('/authorize', middlewares.ensureLogin, authorize.checkAuthorizeParams, authorize.showAppInfo);
router.post('/authorize', middlewares.ensureLogin,authorize.checkAuthorizeParams, authorize.confirmApp); // 点击确认授权后authorize.confirmApp 通过generateAuthorizationCode函数生成code并跳转到example/auth/callback
router.post('/access_token', authorize.getAccessToken);


module.exports = router;

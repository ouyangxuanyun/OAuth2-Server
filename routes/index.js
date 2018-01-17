const express = require('express');
const router = express.Router();
const authorize = require('../lib/authorize');
const client = require('./client');

router.get('/', function (req, res, next) {
    res.json({res: "success"});
});

router.get('/example', client.example);
// /example页面 请求获取文章列表 接口会首先检查是否有access_token,如果未获取授权码，则先跳转到授权页面/example/auth

router.get('/example/auth', client.requestAuth);
// client调用getRedirectUrl函数跳转到授权页面/OAuth2/authorize,query参数client_id，redirect_url
// 点击确认授权后会经过 router.post('/authorize', middlewares.ensureLogin,authorize.checkAuthorizeParams, authorize.confirmApp);

router.get('/example/auth/callback', client.authCallback);
//经过 上面的post路由authorize.confirmApp后会跳转到此路由，执行client.authCallback中间件通过请求/access_token获取access_token
// (通过请求/access_token路由请求，参数有新建client时定义的appKey(client_id),appSecret(client_secret),callbackUrl(redirect_uri)和上一步获取的code(code))
//如果获取成功则重新跳转到/example页面 请求获取文章列表 接口

module.exports = router;

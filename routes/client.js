/**
 * 简单API服务器
 */

const APICleint = require('../api-client');
const fakeData = require('./data.json');

const client = new APICleint({
    appKey: 'a10086',
    appSecret: 'xffcncgmveu6slxg',
    callbackUrl: 'http://127.0.0.1:3000/example/auth/callback'
});


exports.requestAuth = function (req, res, next) {
    res.redirect(client.getRedirectUrl());
};

exports.authCallback = function (req, res, next) {
    client.requestAccessToken(req.query.code)
        .then(ret => {
            // 显示授权成功页面
            console.log(ret);
            res.redirect('/example');
        })
        .catch(err => {
            return res.send(err.toString());
        });
};

exports.example = function (req, res, next) {
    // 如果未获取授权码，则先跳转到授权页面
    if (!client.accessToken) return res.redirect('/example/auth');
    // 暂时用假数据代替
    res.json(fakeData)

    // 请求获取文章列表
    // client.getArticles(req.query, function (err, ret) {
    //     console.log(222, err, ret);
    //     if (err) return res.send(err.toString());
    //     res.send({
    //         accessToken: client.accessToken,
    //         result: ret
    //     });
    // });
};

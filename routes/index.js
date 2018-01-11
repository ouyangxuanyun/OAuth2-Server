var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


router.get('/', function(req, res, next) {
    res.render('authorize', { loginUserId: 'Fu',appInfo:{name:'微信哈哈',description:'自创应用'} });
});

module.exports = router;

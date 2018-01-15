const express = require('express');
const router = express.Router();
const middlewares = require('../lib/middlewares');
const authorize = require('../lib/authorize');

/* GET users listing. */
router.get('/authorize', middlewares.ensureLogin, authorize.checkAuthorizeParams, authorize.showAppInfo);
router.post('/authorize', middlewares.ensureLogin,authorize.checkAuthorizeParams, authorize.confirmApp);
router.post('/access_token', authorize.getAccessToken);

module.exports = router;

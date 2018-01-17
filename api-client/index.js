const parseUrl = require('url').parse;
const formatUrl = require('url').format;
const rq = require('request-promise-native');

const addQueryParamsToUrl = (url, params) => {
    let info = parseUrl(url, true);
    for (let i in params) {
        info.query[i] = params[i];
    }
    delete info.search;
    return formatUrl(info);
}

// 定义请求API的地址
let API_URL = 'http://127.0.0.1:3000';
let API_OAUTH2_AUTHORIZE = API_URL + '/OAuth2/authorize';
let API_OAUTH2_ACCESS_TOKEN = API_URL + '/OAuth2/access_token';
let API_ARTICLES = API_URL + '/api/v1/articles.json';

class APIClient {
    constructor(options) {
        this.appKey = options.appKey;
        this.appSecret = options.appSecret;
        this.callbackUrl = options.callbackUrl;
    }

    // 生成获取授权的跳转地址
    getRedirectUrl() {
        return addQueryParamsToUrl(API_OAUTH2_AUTHORIZE, {
            client_id: this.appKey,
            redirect_uri: this.callbackUrl
        })
    }

    // 发送请求
    request(method, url, params) {
        method = method.toUpperCase();

        // 如果已经获取了access_token，则字加上source和access_token两个参数
        if (this.accessToken) {
            params.source = this.appKey;
            params.access_token = this.accessToken;
        }

        // 根据不同的请求方法，生成用于request模块的参数
        let requestParams = {
            method: method,
            url: url
        };
        if (method === 'GET' || method === 'HEAD') {
            requestParams.qs = params;
        } else {
            // requestParams.formData = params;
            requestParams.json = true;
            requestParams.body = params;
        }

        return rq(requestParams)
            .then(body => {
                // let data = JSON.parse(body.toString());
                let data = JSON.parse(JSON.stringify(body));
                if (data.status !== 'OK') {
                    return {
                        code: data.error_code,
                        message: data.error_message
                    };
                }
                return data.result;
            })
            .catch(err => {
                throw err;
            })
    }

    // 获取access_token
    requestAccessToken(code) {
        let _this = this;
        return this.request('post', API_OAUTH2_ACCESS_TOKEN, {
            code: code,
            client_id: this.appKey,
            client_secret: this.appSecret,
            redirect_uri: this.callbackUrl
        }).then(ret => {
            if (ret) _this.accessToken = ret.access_token;
            return ret;
        });
    };

}

module.exports = APIClient;

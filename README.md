# OAuth2-Server
a NodeJs OAuth2 Server

## install & run
$ git clone https://github.com/ouyangxuanyun/OAuth2-Server<br>
$ cd OAuth2-Server<br>
$ npm install<br>
$ node ./bin/www<br>
打印出Magic happen at port 3000 说明服务正常运行，访问 http://127.0.0.1:3000/example 接口即可

## step by step

1 引导需要授权的用户到Web授权页面 <br>  https://localhost:3000/oauth2/authorize?clientid=XX&response_type=XX&redirect_uri=XX
- https://localhost:3000/oauth2/authorize :API服务的授权页面
- client_id: API服务给当前应用分配的app_key
- repose_type: 授权码类型，默认为code
- redirect_uri: 授权成功后的回调地址,用户点击确认授权后API服务会引导浏览器跳转到此地址，并且在url加上参数code=authorization_code,用于获取access_token 的 code

2 若用户同意授权，页面跳转至redirect_uri/?code=CODE,生成用于获取access_token的authorization_code，跳转回申请授权的应用

3 应用接收到第2步中的code后，请求以下地址获取access_token:<br>
https://localhost:3000/oauth2/access_token?client_id=XX&client_secret=XXgrant_type=XXredirect_uri=XX

4 成功获取access_token后，调用API，带上 source（当前应用的 app_key）和access_token参数

## OAuth2/authorize
1 应用请求用户的授权时需要跳转到此页面，由API服务提供方来检查用户是否已登录，并显示授权页面。当用户点击确认授权按钮时生成authorization_code并跳转回应用提供的URL<br>
2 验证用户是否已登录 ensureLogin<br>
3 显示授权页面。跳转到授权页面时需要应用提供client_id和redirect_id 两个参数，用一个中间件校验参数
  missingParameterError，checkAuthorizeParams<br>
4 验证参数通过后显示确认授权页面， post方式提交表单<br>
5 处理授权。用户点击确认授权生成authorization_code并跳转回源应用，返回回调地址回增加一些新的参数如code

## OAuth2/access_token
1 应用拿到申请用户授权成功后的authorization_code，就可以通过Auth2/access_token接口来获取access_token,
  首先验证authorizetion_code,然后生成access_token

## 每次API请求前都需要验证 access token
verifyAccessToken()




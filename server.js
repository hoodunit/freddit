var http = require('http');
var connect = require('connect');
var path = require('path');
var fs = require('fs');
var url = require('url');
var request = require('request');
var querystring = require('querystring');


var isReleaseBuild = process.argv[2] === 'release';

connect.static.mime.define({'application/x-web-app-manifest+json': ['webapp']});
connect.static.mime.define({'text/cache-manifest': ['appcache']});

var server = connect()
  .use(connect.favicon())
  .use(connect.logger('tiny'))
  .use(routeRequests)
  .use(connect.static(path.join(__dirname, 'app')));

function routeRequests(clientRequest, clientResponse, next) {
  var urlParts = url.parse(clientRequest.url, true);
  var pathname = urlParts.pathname;
  if(pathname === '/'){
    var query = urlParts.query;
    if(query.code){
      returnAccessToken(clientResponse, query);
    } else {
      returnApp(clientResponse, next);
    }
  } else if(pathname.substring(0,6) === '/oauth'){
    returnOAuthResponse(clientRequest, clientResponse, pathname);
  } else {
    return next();
  }
}

function returnApp(clientResponse, next){
  fs.readFile('./app/index.html', 'utf8', function(err, data) {
    if(err) return next(err);
    
    var mainPath = isReleaseBuild ? 'js/main-built.js' : 'js/main.js';
    data = data.replace(/\[\%mainPath\%\]/, mainPath);
    clientResponse.writeHead(200, { 'Content-Type': 'text/html'});
    clientResponse.end(data);
  });
}

function returnAccessToken(clientResponse, query){
  var CLIENT_ID = 'URa40XpCminqLw';
  var CLIENT_SECRET = 'j4QmMWBEIkUQ0-dm3SyWssJ0MTU';
  var REDIRECT_URI = 'http://localhost:8081';
  var ACCESS_TOKEN_URL = 'https://ssl.reddit.com/api/v1/access_token';
  var auth = {user: CLIENT_ID, pass: CLIENT_SECRET};
  var params = {'state': 'w9824laksgrewo0',
                'client_id': CLIENT_ID, 'redirect_uri': REDIRECT_URI,
                'code': query.code, 'grant_type': 'authorization_code'};

  request.post({url: ACCESS_TOKEN_URL, auth: auth, form: params},
               function (oauth_err, oauth_resp, oauth_body) {
                 fs.readFile('./app/oauth.html', 'utf8', function(err, data) {
                   if(err) return next(err);
                   
                   clientResponse.writeHead(200, { 'Content-Type': 'text/html'});
                   clientResponse.write(data);
                   clientResponse.write(oauth_body);
                   clientResponse.end();
                 });
               });
}

function returnOAuthResponse(clientRequest, clientResponse, pathname){
  var oauthRequest = pathname.substring(7);
  var uri = 'https://oauth.reddit.com/' + oauthRequest;
  var authorization = clientRequest.headers.authorization;
  request({uri: uri,
           method: 'GET',
           headers: {authorization: authorization}},
          function(error, redditResponse, redditBody) {
            clientResponse.writeHead(200, { 'Content-Type': 'text/html'});
            clientResponse.end(redditBody);
          });
}

var port = process.env.PORT || 8081;
var host = process.env.IP || '0.0.0.0';
http.createServer(server).listen(port, host);
console.log('Server running at http://' + host + ':' + port);

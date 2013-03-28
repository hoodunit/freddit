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

var server = connect().use(function(req, resp, next) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var pathname = url_parts.pathname;
  console.log('url: ', req.url);
  if(pathname === '/'){
    if(query.code){
      var client_id = 'URa40XpCminqLw';
      var client_secret = 'j4QmMWBEIkUQ0-dm3SyWssJ0MTU';
      var redirect_uri = 'http://localhost:8081';
      var access_token_url = 'https://ssl.reddit.com/api/v1/access_token';
      var auth = {user: client_id, pass: client_secret};
      var params = {'state': 'adsf', 'scope': 'identity',
                    'client_id': client_id, 'redirect_uri': redirect_uri,
                    'code': query.code, 'grant_type': 'authorization_code'};

      request.post({url: access_token_url, auth: auth, form: params},
                   function (oauth_err, oauth_resp, oauth_body) {
                     console.log('received response:', resp);
                     console.log('received error:', oauth_err);
                     console.log('received body:', oauth_body);
                     console.log(querystring.parse(oauth_body));
                     resp.writeHead(200, { 'Content-Type': 'application/json'});
                     //resp.write(JSON.stringify(oauth_body));
                     resp.write(oauth_body);
                     resp.end();
                   });
    } else {
      console.log('Responding with web app');
      fs.readFile('./app/index.html', 'utf8', function(err, data) {
        if(err) return next(err);
        
        var mainPath = isReleaseBuild ? 'js/main-built.js' : 'js/main.js';
        data = data.replace(/\[\%mainPath\%\]/, mainPath);
        resp.writeHead(200, { 'Content-Type': 'text/html'});
        resp.end(data);
      });
    }
  } else if(pathname === '/oauth'){
    console.log('Received OAuth request');
    console.log('Headers:', req.headers);
    request({uri:"https://oauth.reddit.com/api/v1/me",
             method: 'GET',
             headers: {authorization: req.headers.authorization}},
            function(error, redditResponse, redditBody) {
              console.log('Returning response');
              resp.writeHead(200, { 'Content-Type': 'text/html'});
              resp.end(redditBody);
            });
  } else {
    return next();
  }
}).use(connect.static(path.join(__dirname, 'app')));

var port = process.env.PORT || 8081;
var host = process.env.IP || '0.0.0.0';
http.createServer(server).listen(port, host);
console.log('Server running at http://' + host + ':' + port);

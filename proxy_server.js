var http = require('http');
var httpProxy = require('http-proxy');
var request = require('request');


/*
var proxy = new httpProxy.HttpProxy({
  target: {
    host: 'localhost', 
    port: 8080,
    https: true
  }
});

httpProxy.createServer(function (req, res) {
  console.log('createServer fun called');
  console.log(req.host);
  var options = {
    target: {https: true},
    //host: req.host,
    port: 443
  };
  proxy.proxyRequest(req, res, options);
}).listen(8080);
*/


  /*
var httpProxy = require('http-proxy');

var options = {
    target: {
        https: true
    }
};

httpProxy.createServer(443, 'localhost', options).listen(8080);
*/

//httpProxy.createServer(443, 'google.com').listen(8080);

http.createServer(function (clientRequest, clientResponse) {
  console.log('Received request');
  console.log('headers:', clientRequest.headers);
  request({uri:"https://oauth.reddit.com/api/v1/me",
           method: 'GET',
           headers: {authorization: clientRequest.headers.authorization}},
          function(error, redditResponse, redditBody) {
    console.log('Returning response');
    clientResponse.writeHead(200, { 'Content-Type': 'text/html'});
    clientResponse.end(redditBody);
  });
}).listen(8080);

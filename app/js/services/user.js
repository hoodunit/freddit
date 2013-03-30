define(function () {
  'use strict';

  function User(){
    var accessToken = null;

    this.accessToken = function(){
      return accessToken;
    };

    this.login = function(callback) {
      var STATE = 'f398dasf8wet89823t';
      var RESPONSE_TYPE = 'code';
      var CLIENT_ID = 'URa40XpCminqLw';
      var SCOPE = 'identity,mysubreddits';
      var REDIRECT_URI = 'http://localhost:8081';
      var login_uri = 'https://ssl.reddit.com/api/v1/authorize'
            + '?state=' + STATE
            + '&response_type=' + RESPONSE_TYPE
            + '&client_id=' + CLIENT_ID
            + '&scope=' + SCOPE
            + '&redirect_uri=' + REDIRECT_URI;
      var win = window.open(login_uri, "Reddit Sign In", 'width=800, height=600'); 

      var pollTimer = window.setInterval(function() { 
        if(win.document.URL.indexOf(REDIRECT_URI) != -1) {
          var data = JSON.parse(win.document.body.textContent);
          accessToken = data.access_token;
          console.log('Access token:', accessToken);
          window.clearInterval(pollTimer);
          win.close();
          callback();
        }
      }, 500);
    };

    this.logout = function(callback){
      accessToken = null;
      callback();
    };

    this.loggedIn = function(){
      return accessToken != null;
    };
  }

  return User;
});

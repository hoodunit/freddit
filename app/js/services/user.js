define(function () {
  'use strict';

  function User($http, $q){
    var _accessToken = null;
    var userName = null;

    this.accessToken = function(){
      return _accessToken;
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
          _accessToken = data.access_token;
          console.log('Access token:', _accessToken);
          window.clearInterval(pollTimer);
          win.close();
          callback();
        }
      }, 500);
    };

    this.getUserName = function(){
      userName = $q.defer();
      var url = 'http://localhost:8081/oauth/api/v1/me';
      var headers = {'Authorization': 'bearer ' + _accessToken};
      $http.get(url, {headers: headers}).success(function(userData){
        userName.resolve(userData.name);
      });

      return userName.promise;
    };

    this.logout = function(callback){
      _accessToken = null;
      callback();
    };

    this.loggedIn = function(){
      return _accessToken != null;
    };
  }

  User.$inject = ['$http', '$q'];

  return User;
});

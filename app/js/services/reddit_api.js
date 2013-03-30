define(function () {
  'use strict';

  function RedditAPI($http, $q){
    var STATE = 'f398dasf8wet89823t';
    var RESPONSE_TYPE = 'code';
    var CLIENT_ID = 'URa40XpCminqLw';
    var SCOPE = 'identity,mysubreddits';
    var REDIRECT_URI = 'http://localhost:8081';

    var REDDIT_URI = 'http://reddit.com';
    var REDDIT_SSL_URI = 'https://ssl.reddit.com';
    var REDDIT_OAUTH_URI = 'http://localhost:8081/oauth';

    var accessToken = null;

    this.login = function(callback) {
      var login_uri = REDDIT_SSL_URI + '/api/v1/authorize'
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

    this.getUserName = function(){
      var userName = $q.defer();
      var url = REDDIT_OAUTH_URI + '/api/v1/me';
      var headers = {'Authorization': 'bearer ' + accessToken};
      $http.get(url, {headers: headers}).success(function(userData){
        userName.resolve(userData.name);
      });

      return userName.promise;
    };

    this.logout = function(callback){
      accessToken = null;
      callback();
    };

    this.loggedIn = function(){
      return accessToken != null;
    };

    this.getSubreddit = function(subredditName){
      var subreddit = $q.defer();
      var url = REDDIT_URI + '/r/' + subredditName + '/new.json?jsonp=JSON_CALLBACK';
      $http.jsonp(url).success(function(data){
        var firstPost = data.data.children[0];
        subreddit.resolve({'name': firstPost.data.subreddit,
                         'first_post_url': firstPost.data.url});
      });

      return subreddit.promise;
    };

    this.loadUserSubreddits = function(callback){
      var url = REDDIT_OAUTH_URI + '/subreddits/mine/subscriber.json';
      var headers = {'Authorization': 'bearer ' + accessToken};

      $http.get(url, {headers: headers}).success(function(subscribedData){
        var subredditsData = subscribedData.data.children;
        var subredditNames = [];
        for(var i = 0; i < subredditsData.length; i++){
          var subredditName = subredditsData[i].data.display_name;
          subredditNames.push(subredditName);
        }
        callback(subredditNames);
      });
    };
  }

  RedditAPI.$inject = ['$http', '$q'];

  return RedditAPI;
});

define(function () {
  'use strict';

  function RedditAPI($http, $q){
    var STATE = 'f398dasf8wet89823t';
    var RESPONSE_TYPE = 'code';
    var CLIENT_ID = 'URa40XpCminqLw';
    var SCOPE = 'identity,mysubreddits';
    var REDIRECT_URL = 'http://localhost:8081';

    var REDDIT_URL = 'http://reddit.com';
    var REDDIT_SSL_URL = 'https://ssl.reddit.com';
    var REDDIT_OAUTH_URL = 'http://localhost:8081/oauth';

    var accessToken = null;

    this.login = function(callback) {
      var login_url = REDDIT_SSL_URL + '/api/v1/authorize'
            + '?state=' + STATE
            + '&response_type=' + RESPONSE_TYPE
            + '&client_id=' + CLIENT_ID
            + '&scope=' + SCOPE
            + '&redirect_uri=' + REDIRECT_URL;
      var win = window.open(login_url, "Reddit Sign In", 'width=800, height=600'); 

      var pollTimer = window.setInterval(function() { 
        if(win.document.URL.indexOf(REDIRECT_URL) != -1) {
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
      var url = REDDIT_OAUTH_URL + '/api/v1/me';
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

    this.getSubredditFirstImageUrl = function(subredditName){
      var imageUrl = $q.defer();
      var url = REDDIT_URL + '/r/' + subredditName + '/new.json?jsonp=JSON_CALLBACK&limit=1';
      $http.jsonp(url).success(function(data){
        var firstPost = data.data.children[0];
        imageUrl.resolve(firstPost.data.url);
      });

      return imageUrl.promise;
    };

    this.getSubredditPosts = function(subredditName, callback){
      var posts = $q.defer();
      var url = REDDIT_URL + '/r/' + subredditName + '.json?jsonp=JSON_CALLBACK';
      var extractDirectImageLink = this.extractDirectImageLink;

      $http.jsonp(url).success(function(data){
        var postsData = data.data.children;
        var parsedPosts = [];

        for(var i = 0; i < postsData.length; i++){
          var postData = postsData[i];
          var directLink = extractDirectImageLink(postData.data.url);
          if(directLink !== null){
            var post = {'id': postData.data.id,
                        'url': directLink,
                        'title': postData.data.title};
            parsedPosts.push(post);
          }
        }
        posts.resolve(parsedPosts);
      });

      return posts.promise;
    };

    this.extractDirectImageLink = function(url) {
      var res;

      // TODO: heuristic: anything that ends with .gif/.jpg/.png is a direct link ?!

      // imgur
      if ((res = /(.*)imgur.com\/(.*)/.exec(url))) {
        if (/i\./.exec(res[1])) {
          return url;
        }
        // TODO: other kinds of imgur source ?
        return null;
      }
      // fbcdn
      if ((res = /(.*)fbcdn(.*)\/(.*)\.(.*)/.exec(url))) {
        return url;
      }
      return null;
    };

    this.loadUserSubreddits = function(callback){
      var url = REDDIT_OAUTH_URL + '/subreddits/mine/subscriber.json';
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

    this.getPost = function(postId){
      var post = $q.defer();
      var url = REDDIT_URL + '/by_id/t3_' + postId + '.json?jsonp=JSON_CALLBACK';
      $http.jsonp(url).success(function(object){
          var postData = object.data.children[0].data;
          post.resolve(postData);
        });
      return post.promise;
    };
  }

  RedditAPI.$inject = ['$http', '$q'];

  return RedditAPI;
});

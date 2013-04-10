define(function () {
  'use strict';

  function RedditAPI($http, $q, $window){
    var STATE = 'f398dasf8wet89823t';
    var RESPONSE_TYPE = 'code';
    var CLIENT_ID = 'URa40XpCminqLw';
    var SCOPE = 'identity,mysubreddits';
    var REDIRECT_URL = 'http://localhost:8081';

    var REDDIT_URL = 'http://reddit.com';
    var REDDIT_SSL_URL = 'https://ssl.reddit.com';
    var REDDIT_OAUTH_URL = 'http://localhost:8081/oauth';

    var accessToken = null;

    var subRedditPosts = null;


    this.login = function(callback) {
      var login_url = REDDIT_SSL_URL + '/api/v1/authorize'
            + '?state=' + STATE
            + '&response_type=' + RESPONSE_TYPE
            + '&client_id=' + CLIENT_ID
            + '&scope=' + SCOPE
            + '&redirect_uri=' + REDIRECT_URL;

      $window.addEventListener("message", this.receiveLoginResponse(callback), false);
      $window.open(login_url, 'reddit_oauth_signin'); 
    };

    this.receiveLoginResponse = function(callback){
      return function(event){
        if (event.origin !== REDIRECT_URL){
          console.log('Received message from invalid origin:', event.origin);
          console.log(event);
          return;
        }
        console.log('Received message:', event);
        if(event.data && event.data.access_token){
            accessToken = event.data.access_token;
        }
        console.log('Access token:', accessToken);
        callback();
      }
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
      var url = REDDIT_URL + '/r/' + subredditName + '/new.json?jsonp=JSON_CALLBACK&obey_over18=true&limit=1';
      var extractDirectImageLink = this.extractDirectImageLink;
      $http.jsonp(url).success(function(data){
        var firstPost = data.data.children[0];
        var directLink = extractDirectImageLink(firstPost.data.url);
        //console.log(firstPost.data.url);
        if (directLink == null) {
          // TODO: do something if we are unable to get the first image
          imageUrl.resolve('');
        } else {
          imageUrl.resolve(directLink);
        }
      });
      return imageUrl.promise;
    };

    this.getSubredditPosts = function(subredditName){
      var posts = $q.defer();
      var url = REDDIT_URL + '/r/' + subredditName + '.json?jsonp=JSON_CALLBACK&obey_over18=true';
      var extractDirectImageLink = this.extractDirectImageLink;
      subRedditPosts = [];
      $http.jsonp(url).success(function(data){
        var postsData = data.data.children;
        var parsedPosts = [];

        for(var i = 0; i < postsData.length; i++){
          var postData = postsData[i];
          console.log('srcLink: '+postData.data.url);
          var directLink = extractDirectImageLink(postData.data.url);
          console.log('directLink: '+directLink);
          if(directLink !== null){
            var post = {'id': postData.data.id,
                        'url': directLink,
                        'title': postData.data.title};
            parsedPosts.push(post);

            //Global
            subRedditPosts.push(post);
          }
        }
        posts.resolve(parsedPosts);
      });

      return posts.promise;
    };

    this.extractDirectImageLink = function(url) {
      var res;

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
      // flickr
      if (res = /(.*)flickr\.com(.*)/.exec(url)) {
        if (/farm(.*)staticflickr\.com(.*)\.(.*)/.exec(url)) {
          return url;
        }
        // TODO: use their API to get direct link?
        return null;
      }
      // tumblr
      if (res = /(.*)\.tumblr\.com\/(.*)/.exec(url)) {
        if (/(.*)\.(.*)/.exec(res[2])) {
          return url;
        }
        return null;
      }
      // cheezburger
      if (res = /(.*)i\.chzbgr\.com(.*)/.exec(url)) {
        return url;
      }
      // heuristic: .jpg/.gif/.png are direct links!
      if (res = /(.*)\.jpg|(.*)\.gif|(.*)\.png/.exec(url)) {
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


    this.getPosts = function(postId){
        var previousId = 0;
        var nextId = 0;
        for(var i = 0 ; i < subRedditPosts.length ; i++){
            if (subRedditPosts[i].id == postId) {
              //console.log("hi");
              if(i == (subRedditPosts.length - 1)){
                nextId = subRedditPosts[(subRedditPosts.length - 1)].id;
              } else {
                nextId = subRedditPosts[i+1].id;
              }
              break;
            };
            previousId = subRedditPosts[i].id;
        }
        var ids = [];
        ids.push(previousId);
        ids.push(nextId);
        return ids;
    };

  }

  RedditAPI.$inject = ['$http', '$q', '$window'];

  return RedditAPI;
});

define(function () {
  'use strict';

  function RedditAPI($http, $q, $window, Settings){
    var STATE = 'f398dasf8wet89823t';
    var RESPONSE_TYPE = 'code';
    var CLIENT_ID = 'URa40XpCminqLw';
    var SCOPE = 'identity,mysubreddits';
    var REDIRECT_URL = 'http://localhost:8081';

    var REDDIT_URL = 'http://reddit.com';
    var REDDIT_SSL_URL = 'https://ssl.reddit.com';
    var REDDIT_OAUTH_URL = 'http://localhost:8081/oauth';
    var SHOW_NSFW = "obey_over18=false";
    var HIDE_NSFW = "obey_over18=true";

    var accessToken = null;
    this.username = $q.defer();

    var DEFAULT_SUBREDDITS = ['pics', 'mapporn', 'aww', 'cityporn', 'lolcats', 'corgi'];

    var subredditPosts = null;

    var FIRST_IMAGE_SPECULATIVE_SIZE = 10;
    var DEFAULT_IMAGE_URL = 'http://www.redditstatic.com/icon.png';


    //Paging support
    var nextPostID = null;
    var previousPostID = null;
    var lastPage = null;
    var lastURL = null;
    var lastSortParam = null;

    this.resetSubreddits = function(){
      this.subredditNames = DEFAULT_SUBREDDITS;
      this.subreddits = null;
    }

    this.getSubreddits = function(){
      if(this.subreddits === null){
        return this.loadSubreddits();
      } else {
        return this.subreddits;
      }
    };

    this.loadSubreddits = function(){
      var subreddits = [];
      for(var i = 0, subredditName; subredditName = this.subredditNames[i]; i++){
        var imageUrl = this.getSubredditFirstImageUrl(subredditName);
        var subreddit = {'name': subredditName, 'first_image_url': imageUrl};
        subreddits.push(subreddit);
      };
      this.subreddits = subreddits;
      return subreddits;
    };

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
      var redditApi = this;
      return function(event){
        if (event.origin !== REDIRECT_URL){
          return;
        }
        if(event.data && event.data.access_token){
          accessToken = event.data.access_token;
          redditApi.fetchUsername();
          redditApi.getUserSubredditNames(callback);
        }
      };
    };

    this.getUsername = function(){
      return this.username.promise;
    };

    this.fetchUsername = function(){
      var url = REDDIT_OAUTH_URL + '/api/v1/me';
      var headers = {'Authorization': 'bearer ' + accessToken};
      var redditApi = this;
      $http.get(url, {headers: headers}).success(function(userData){
        redditApi.username.resolve(userData.name);
      });
    };

    this.logout = function(callback){
      accessToken = null;
      this.username = $q.defer();
      this.resetSubreddits();
      callback();
    };

    this.loggedIn = function(){
      return accessToken != null;
    };

    this.getSubredditFirstImageUrl = function(subredditName){
      var imageUrl = $q.defer();
      var url = REDDIT_URL + '/r/'
        + subredditName + '/new.json?jsonp=JSON_CALLBACK&'
        + this.getNSFWString() + '&limit=' + FIRST_IMAGE_SPECULATIVE_SIZE;
      var extractDirectImageLink = this.extractDirectImageLink;
      $http.jsonp(url).success(function(data){
        var i = 0;
        for (i = 0;i < data.data.children.length;i ++) {
          var firstPost = data.data.children[i];
          var over18 = firstPost.data.over_18;

          if(Settings.getNSFWFlag() || over18 !== true){
            var directLink = extractDirectImageLink(firstPost.data.url);
            if (directLink != null) {
              imageUrl.resolve(directLink);
              break;
            }
          }
        }
        if (i == data.data.children.length) {
          imageUrl.resolve(DEFAULT_IMAGE_URL);
        } 
      }). 
      error(function(data, status) {
        imageUrl.resolve(DEFAULT_IMAGE_URL);
      });
      return imageUrl.promise;
    };

    this.getSubredditPosts = function(subredditName, page){
      return this.getSubredditPostsSortedBy(subredditName, 'hot' , page);
    };

    this.getHotSubredditPosts = function(subredditName, page){
      return this.getSubredditPostsSortedBy(subredditName, 'hot', page);
    };

    this.getNewSubredditPosts = function(subredditName, page){
      return this.getSubredditPostsSortedBy(subredditName, 'new', page);
    };

    this.getRisingSubredditPosts = function(subredditName, page){
      return this.getSubredditPostsSortedBy(subredditName, 'rising', page);
    };

    this.getTopSubredditPosts = function(subredditName, page){
      return this.getSubredditPostsSortedBy(subredditName, 'top', page);
    };

    this.getControversialSubredditPosts = function(subredditName, page){
      return this.getSubredditPostsSortedBy(subredditName, 'controversial', page);
    };

    this.getSubredditPostsSortedBy = function(subredditName, sortParam, page){
      var posts = $q.defer();

      if (sortParam != lastSortParam) {
        nextPostID = null;
        previousPostID = null;
        lastPage = null;
        lastURL = null;
        page = 1;
      }
      lastSortParam = sortParam;
      if (page == 1) {
        var url = REDDIT_URL + '/r/' + subredditName
        + '.json?jsonp=JSON_CALLBACK&'
        + this.getNSFWString() + '&sort=' + sortParam;
        lastPage = 1;
        lastURL = url;
      } else if (page > lastPage){
        //We are loading the next page
        var url = REDDIT_URL + '/r/' + subredditName
        + '.json?jsonp=JSON_CALLBACK&'
        + this.getNSFWString() + '&sort=' + sortParam + '&after=' + nextPostID;
        lastPage = page;
        lastURL = url;
      } else if (page < lastPage) {
        //We are loading the previous page
        var url = REDDIT_URL + '/r/' + subredditName
        + '.json?jsonp=JSON_CALLBACK&'
        + this.getNSFWString() + '&sort=' + sortParam + '&before=' + previousPostID;
        lastPage = page;
        lastURL = url
      } else {
          //We are loading the same page than before
          var url = lastURL;
      }
      console.log(url);
      var extractDirectImageLink = this.extractDirectImageLink;
      subredditPosts = [];
      $http.jsonp(url).success(function(data){
        var postsData = data.data.children;
        var parsedPosts = [];
        //For loading next or previouses subreddit images
        nextPostID = data.data.after;
        previousPostID = data.data.before;
        for(var i = 0; i < postsData.length; i++){
          var postData = postsData[i].data;
          var over18 = postData['over_18'];
          if(Settings.getNSFWFlag() || over18 !== true){
            var directLink = extractDirectImageLink(postData.url);
            if(directLink !== null){
              var post = {'id': postData.id,
                          'url': directLink,
                          'title': postData.title};
              parsedPosts.push(post);
              subredditPosts.push(post);
            }
          }
        }
        posts.resolve(parsedPosts);
      }).error(function(data, status) {
        posts.reject('getSubredditPostsSortedBy: API access failed');
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
        return null;
      }
      // Facebook CDN
      if ((res = /(.*)fbcdn(.*)\/(.*)\.(.*)/.exec(url))) {
        return url;
      }
      // Flickr farms
      if (res = /(.*)flickr\.com(.*)/.exec(url)) {
        if (/farm(.*)staticflickr\.com(.*)\.(.*)/.exec(url)) {
          return url;
        }
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
      // heuristic: anything else that ends in .jpg/.gif/.png are direct links!
      if (res = /(.*)\.jpg|(.*)\.gif|(.*)\.png/.exec(url)) {
        return url;
      }

      return null;
    };

    this.getUserSubredditNames = function(callback){
      var url = REDDIT_OAUTH_URL + '/subreddits/mine/subscriber.json';
      var headers = {'Authorization': 'bearer ' + accessToken};

      var redditApi = this;
      var subredditNames = [];

      $http.get(url, {headers: headers}).success(function(subscribedData){
        var subredditsData = subscribedData.data.children;
        var subredditNames = [];
        for(var i = 0; i < subredditsData.length; i++){
          var subredditName = subredditsData[i].data.display_name;
          subredditNames.push(subredditName);
        }
        
        redditApi.subredditNames = subredditNames;
        redditApi.subreddits = null;
        callback();
      });
    };

    this.getPost = function(postId){
      var post = $q.defer();
      var url = REDDIT_URL + '/by_id/t3_' + postId + '.json?jsonp=JSON_CALLBACK';
      $http.jsonp(url).success(function(object){
          var postData = object.data.children[0].data;
          post.resolve(postData);
        }).error(function(object){
          post.reject(false);
        });
      return post.promise;
    };

    this.getPosts = function(postId){
        var previousId = false;
        var nextId = 0;
        for(var i = 0 ; i < subredditPosts.length ; i++){
            if (subredditPosts[i].id == postId) {
              if(i == (subredditPosts.length - 1)){
                nextId = false;
              } else {
                nextId = subredditPosts[i+1].id;
              }
              break;
            };
            previousId = subredditPosts[i].id;
        }
        var ids = [];
        ids.push(previousId);
        ids.push(nextId);
        return ids;
    };

    this.getNSFWString = function(){
      if(Settings.getNSFWFlag()){
        return SHOW_NSFW;
      } else {
        return HIDE_NSFW;
      }
    }

    this.resetSubreddits();
  }

  RedditAPI.$inject = ['$http', '$q', '$window', 'Settings'];

  return RedditAPI;
});
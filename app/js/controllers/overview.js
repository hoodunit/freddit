define(function () {
  'use strict';


  function OverviewCtrl($scope, $routeParams, $location, $http) {
    //$scope.accessToken = null;

    $scope.loggedIn = function(){
      return $scope.accessToken != null;
    }

    $scope.login = function() {
      var STATE = 'f398dasf8wet89823t';
      var RESPONSE_TYPE = 'code';
      var CLIENT_ID = 'URa40XpCminqLw';
      var SCOPE = 'identity';
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
          console.log(win);
          console.log(win.document);
          var data = JSON.parse(win.document.body.textContent);
          $scope.accessToken = data.access_token;
          console.log('Data:', data);
          console.log('Access token:', $scope.accessToken);
          $scope.$apply();
          console.log('Access token:', $scope.accessToken);
          window.clearInterval(pollTimer);
          win.close();
          $scope.loadUserSubreddits();
        }
      }, 500);
    }

    $scope.loadUserSubreddits = function(){
      //var url = 'https://oauth.reddit.com/api/v1/me';
      var url = 'http://localhost:8081/oauth';
      console.log('load reddits access token:', $scope.accessToken);
      var headers = {'Authorization': 'bearer ' + $scope.accessToken};
      $http.get(url, {headers: headers}).success(function(userData){
        console.log('success:', userData);
        $scope.userName = userData.name
      });
    }

    $scope.loadSubreddits = function(subreddits){
      $scope.subreddits = [];
      for(var i = 0, subredditName; subredditName = DEFAULT_SUBREDDITS[i]; i++){
        var url = 'http://reddit.com/r/' + subredditName + '/new.json?jsonp=JSON_CALLBACK';
        $http.jsonp(url).success(function(data){
          var firstPost = data.data.children[0];
          var subreddit = {'name': firstPost.data.subreddit,
                           'first_post_url': firstPost.data.url};
          $scope.subreddits.push(subreddit);
        });
      }
    }

    var DEFAULT_SUBREDDITS = ['pics', 'mapporn', 'aww', 'cityporn', 'lolcats', 'corgi'];
    $scope.loadSubreddits(DEFAULT_SUBREDDITS);
  }

  OverviewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http'];

  return OverviewCtrl;

});

define(function () {
  'use strict';


  function OverviewCtrl($scope, $routeParams, $location, $http) {
    $scope.loggedIn = function(){
      return $scope.accessToken != null;
    }

    $scope.login = function() {
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
          $scope.accessToken = data.access_token;
          $scope.$apply();
          console.log('Access token:', $scope.accessToken);
          window.clearInterval(pollTimer);
          win.close();
          $scope.loadUserSubreddits();
        }
      }, 500);
    }

    $scope.loadUserSubreddits = function(){
      var url = 'http://localhost:8081/oauth/api/v1/me';
      var headers = {'Authorization': 'bearer ' + $scope.accessToken};
      $http.get(url, {headers: headers}).success(function(userData){
        $scope.userName = userData.name
      });

      url = 'http://localhost:8081/oauth/subreddits/mine/subscriber.json';
      $http.get(url, {headers: headers}).success(function(subscribedData){
        var subredditsData = subscribedData.data.children;
        var subreddits = [];
        for(var i = 0; i < subredditsData.length; i++){
          subreddits.push(subredditsData[i].data.display_name);
        }
        $scope.loadSubreddits(subreddits);
      });
    }

    $scope.loadSubreddits = function(subreddits){
      $scope.subreddits = [];
      for(var i = 0, subredditName; subredditName = subreddits[i]; i++){
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

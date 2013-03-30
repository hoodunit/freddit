define(function () {
  'use strict';

  function OverviewCtrl($scope, $routeParams, $location, $http, RedditAPI) {
    var DEFAULT_SUBREDDITS = ['pics', 'mapporn', 'aww', 'cityporn', 'lolcats', 'corgi'];

    $scope.loggedIn = RedditAPI.loggedIn;
    $scope.login = function(){
      RedditAPI.login(function(){
        $scope.$apply();
        $scope.userName = RedditAPI.getUserName();
        RedditAPI.loadUserSubreddits(function(subredditNames){
          $scope.loadSubreddits(subredditNames);
        });
      });
    };

    $scope.logout = function(){
      RedditAPI.logout(function(){
        $scope.loadSubreddits(DEFAULT_SUBREDDITS);
      });
    }

    $scope.loadSubreddits = function(subredditNames){
      $scope.subreddits = [];
      for(var i = 0, subredditName; subredditName = subredditNames[i]; i++){
        var subreddit = RedditAPI.getSubreddit(subredditName);
        $scope.subreddits.push(subreddit);
      };
    }

    $scope.loadSubreddits(DEFAULT_SUBREDDITS);
  }

  OverviewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', 'RedditAPI'];

  return OverviewCtrl;

});

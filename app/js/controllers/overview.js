define(function () {
  'use strict';

  function OverviewCtrl($scope, RedditAPI) {
    var DEFAULT_SUBREDDITS = ['pics', 'mapporn', 'aww', 'cityporn', 'lolcats', 'corgi'];

    $scope.username = RedditAPI.getUsername();
    $scope.loggedIn = RedditAPI.loggedIn;
    $scope.login = function(){
      RedditAPI.login(function(){
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
        var imageUrl = RedditAPI.getSubredditFirstImageUrl(subredditName);
        var subreddit = {'name': subredditName, 'first_image_url': imageUrl};
        $scope.subreddits.push(subreddit);
      };
    }

    $scope.loadSubreddits(DEFAULT_SUBREDDITS);
  }

  OverviewCtrl.$inject = ['$scope', 'RedditAPI'];

  return OverviewCtrl;

});

define(function () {
  'use strict';

  function OverviewCtrl($scope, RedditAPI) {
    $scope.username = RedditAPI.getUsername();
    $scope.loggedIn = RedditAPI.loggedIn;
    
    $scope.login = function(){
      RedditAPI.login($scope.loadSubreddits);
    };

    $scope.logout = function(){
      RedditAPI.logout($scope.loadSubreddits);
    };

    $scope.loadSubreddits = function(){
      $scope.subredditNames = RedditAPI.getSubredditNames();
      $scope.subreddits = [];
      for(var i = 0, subredditName; subredditName = $scope.subredditNames[i]; i++){
        var imageUrl = RedditAPI.getSubredditFirstImageUrl(subredditName);
        var subreddit = {'name': subredditName, 'first_image_url': imageUrl};
        $scope.subreddits.push(subreddit);
      };
    };

    $scope.loadSubreddits();
  }

  OverviewCtrl.$inject = ['$scope', 'RedditAPI'];

  return OverviewCtrl;

});

define(function () {
  'use strict';

  function SubredditsCtrl($scope, $routeParams, RedditAPI) {
    $scope.subredditName = $routeParams.id; 
    $scope.posts = RedditAPI.getSubredditPosts($scope.subredditName);
  }

  SubredditsCtrl.$inject = ['$scope', '$routeParams', 'RedditAPI'];

  return SubredditsCtrl;
});

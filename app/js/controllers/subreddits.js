define(function () {
  'use strict';


  function SubredditsCtrl($scope, $routeParams, RedditAPI) {
    $scope.subredditName = $routeParams.id;
    $scope.orderBy = $routeParams.order;

    this.getSubredditPosts = function(){
      if($scope.orderBy) {
        var promise;
        if($scope.orderBy === "new"){
          promise = RedditAPI.getNewSubredditPosts($scope.subredditName);
        } else if($scope.orderBy === "rising"){
          promise = RedditAPI.getRisingSubredditPosts($scope.subredditName);
        } else if($scope.orderBy === "top"){
          promise = RedditAPI.getTopSubredditPosts($scope.subredditName);
        } else if($scope.orderBy === "controversial"){
          promise = RedditAPI.getControversialSubredditPosts($scope.subredditName);
        } else {
          promise = RedditAPI.getSubredditPosts($scope.subredditName,$scope.orderBy);
        }
      } else {
        promise = RedditAPI.getSubredditPosts($scope.subredditName);

        promise.then(function(posts) {
          $scope.havePosts = true;
          $scope.posts = posts;
        }, function(reason) {
          $scope.havePosts = false;
        });
      }
    };

    this.getSubredditPosts();
  }

  SubredditsCtrl.$inject = ['$scope', '$routeParams', 'RedditAPI'];

  return SubredditsCtrl;
});

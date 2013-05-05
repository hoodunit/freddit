define(function () {
  'use strict';


  function SubredditsCtrl($scope, $routeParams, RedditAPI) {
    $scope.subredditName = $routeParams.id;
    $scope.orderBy = $routeParams.order;
    $scope.showSortSelector = false;
    var page = $routeParams.page;

    if(page) {
      $scope.page = parseInt(page) + 1; 
    } else {
      $scope.page = 0; 
    }

    this.getSubredditPosts = function(){
      if($scope.orderBy) {
        var promise;
        if($scope.orderBy === "new"){
          promise = RedditAPI.getNewSubredditPosts($scope.subredditName, $scope.page);
        } else if($scope.orderBy === "rising"){
          promise = RedditAPI.getRisingSubredditPosts($scope.subredditName, $scope.page);
        } else if($scope.orderBy === "top"){
          promise = RedditAPI.getTopSubredditPosts($scope.subredditName, $scope.page);
        } else if($scope.orderBy === "controversial"){
          promise = RedditAPI.getControversialSubredditPosts($scope.subredditName, $scope.page);
        } else {
          promise = RedditAPI.getSubredditPosts($scope.subredditName, $scope.page);
        }

        promise.then(function(posts) {
          $scope.havePosts = true;
          $scope.posts = posts;
        }, function(reason) {
          $scope.havePosts = false;
        });
      }
    };

    $scope.openSortSelector = function() {
      $scope.showSortSelector = !$scope.showSortSelector;
    };

    this.getSubredditPosts();
  }

  SubredditsCtrl.$inject = ['$scope', '$routeParams', 'RedditAPI'];

  return SubredditsCtrl;
});

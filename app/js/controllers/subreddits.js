define(function () {
  'use strict';


  function SubredditsCtrl($scope, $routeParams, RedditAPI) {
    $scope.subredditName = $routeParams.id;
    $scope.orderBy = $routeParams.order;

    if($scope.orderBy) {
      var promise = RedditAPI.getSubredditPostsSortedBy($scope.subredditName,$scope.orderBy);
      promise.then(function(posts) {
         $scope.havePosts = true;
         $scope.posts = posts;
       }, function(reason) {
         $scope.havePosts = false;
       });
    }
    if($scope.posts == null) {
      var promise = RedditAPI.getSubredditPosts($scope.subredditName);
      promise.then(function(posts) {
         $scope.havePosts = true;
         $scope.posts = posts;
       }, function(reason) {
         $scope.havePosts = false;
       });
    } 
  }

  SubredditsCtrl.$inject = ['$scope', '$routeParams', 'RedditAPI'];

  return SubredditsCtrl;
});

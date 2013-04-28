define(function () {
  'use strict';


  function SubredditsCtrl($scope, $routeParams, RedditAPI) {
    $scope.subredditName = $routeParams.id;
    $scope.orderBy = $routeParams.order;

    if($scope.orderBy){
    	
    	$scope.posts = RedditAPI.getSubredditPostsSortedBy($scope.subredditName,$scope.orderBy);
    } else {
    	$scope.posts = RedditAPI.getSubredditPosts($scope.subredditName);
    }

  }

  SubredditsCtrl.$inject = ['$scope', '$routeParams', 'RedditAPI'];

  return SubredditsCtrl;
});

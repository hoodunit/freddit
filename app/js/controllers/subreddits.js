define(function () {
  'use strict';


  function SubredditsCtrl($scope, $routeParams, RedditAPI) {
    $scope.subredditName = $routeParams.id;
    $scope.orderBy = $routeParams.order;

    if($scope.orderBy){
    	console.log("got parameters");
    	$scope.posts = RedditAPI.getSubredditPostsSortedBy($scope.subredditName,$scope.orderBy);
    	if($scope.posts === null){
    		$scope.posts = RedditAPI.getSubredditPosts($scope.subredditName);
    	} 
    } else {
    	$scope.posts = RedditAPI.getSubredditPosts($scope.subredditName);
    }
    
    //$scope.posts = RedditAPI.getSubredditPosts($scope.subredditName);
    
  }

  SubredditsCtrl.$inject = ['$scope', '$routeParams', 'RedditAPI'];

  return SubredditsCtrl;
});

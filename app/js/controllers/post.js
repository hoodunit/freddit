define(function () {
  'use strict';

  function PostCtrl($scope, $routeParams, RedditAPI) {
    var postId = $routeParams.id;
    var promise = RedditAPI.getPost(postId);
    promise.then(function(info){
      $scope.post = true;
      $scope.infoPost = info;
    }, function(info){
      console.log("Breaking promises" +  info);
      $scope.post = false;
    });
    $scope.infoPost = RedditAPI.getPost(postId);
    

	  var ids = RedditAPI.getPosts(postId);
    $scope.previousPost = ids[1];
    $scope.nextPost = ids[0];
    
  }

  PostCtrl.$inject = ['$scope', '$routeParams', 'RedditAPI'];

  return PostCtrl;
});

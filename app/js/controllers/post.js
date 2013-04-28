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
    if (ids[0] == false) {
      $scope.existNextPost = false;
    } else {
      $scope.nextPost = ids[0];
      $scope.existNextPost = true;
    }
    if (ids[1] == false) {
      $scope.existPreviousPost = false;
    } else {
      $scope.previousPost = ids[1];
      $scope.existPreviousPost = true;
    }
    
    
  }

  PostCtrl.$inject = ['$scope', '$routeParams', 'RedditAPI'];

  return PostCtrl;
});

define(function () {
  'use strict';

  function PostCtrl($scope, $routeParams, RedditAPI) {
    var postId = $routeParams.id;
    $scope.infoPost = RedditAPI.getPost(postId);
  }

  PostCtrl.$inject = ['$scope', '$routeParams', 'RedditAPI'];

  return PostCtrl;
});

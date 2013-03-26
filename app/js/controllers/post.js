define(function () {
  'use strict';

  function PostCtrl($http, $scope, $routeParams, $location) {
    $scope.infoPost = [];
    $scope.subreddit = $scope.$navigate.current.scope.page_title;
    $http.jsonp('http://www.reddit.com/by_id/t3_'+ $routeParams.id + '.json?jsonp=JSON_CALLBACK').
      success(function(object){
        $scope.infoPost = object.data.children[0].data;
      });
  }

  PostCtrl.$inject = ['$http','$scope', '$routeParams', '$location'];

  return PostCtrl;
});
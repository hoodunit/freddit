define(function () {
  'use strict';


function OverviewCtrl($scope, $routeParams, $location, $http) {

//Display the newest post from each of the image subreddits listed here

  $scope.posts = [];
 $http.jsonp('http://reddit.com/r/pics/new.json?jsonp=JSON_CALLBACK').
    success(function(data){
   $scope.posts.push(data.data.children[0]);
    });
     $http.jsonp('http://reddit.com/r/mapporn/new.json?jsonp=JSON_CALLBACK').
    success(function(data){
   $scope.posts.push(data.data.children[0]);
    });
     $http.jsonp('http://reddit.com/r/aww/new.json?jsonp=JSON_CALLBACK').
    success(function(data){ 
   $scope.posts.push(data.data.children[0]);
    });
     $http.jsonp('http://reddit.com/r/cityporn/new.json?jsonp=JSON_CALLBACK').
    success(function(data){
   $scope.posts.push(data.data.children[0]);
    });
      $http.jsonp('http://reddit.com/r/lolcats/new.json?jsonp=JSON_CALLBACK').
    success(function(data){ 
   $scope.posts.push(data.data.children[0]);
    });
        $http.jsonp('http://reddit.com/r/corgi/new.json?jsonp=JSON_CALLBACK').
    success(function(data){ 
   $scope.posts.push(data.data.children[0]);
    });
}

OverviewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http'];

return OverviewCtrl;

});
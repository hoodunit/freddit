define(function () {
  'use strict';

  function OverviewCtrl($scope, RedditAPI) {
    $scope.username = RedditAPI.getUsername();
    $scope.loggedIn = RedditAPI.loggedIn;
    
    $scope.login = function(){
      RedditAPI.login($scope.loadSubreddits);
    };

    $scope.logout = function(){
      RedditAPI.logout($scope.loadSubreddits);
    };

    $scope.loadSubreddits = function(){
      $scope.subreddits = RedditAPI.getSubreddits();
    };

    $scope.loadSubreddits();
  }

  OverviewCtrl.$inject = ['$scope', 'RedditAPI'];

  return OverviewCtrl;

});

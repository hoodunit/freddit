define(function () {
  'use strict';

  function SettingsCtrl($scope, RedditAPI) {
    $scope.nsfw = true;

    $scope.addSubreddit = function(name) {
      alert("Should now be adding " + name);
    }

    $scope.removeSubreddit = function(name) {
      alert("Should now be removing " + name);
    }

    $scope.subreddits = RedditAPI.getSubreddits();
  }
    
  SettingsCtrl.$inject = ['$scope', 'RedditAPI'];

  return SettingsCtrl;

});

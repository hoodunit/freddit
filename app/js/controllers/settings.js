define(function () {
  'use strict';

  function SettingsCtrl($scope, Settings, RedditAPI) {
    $scope.nsfwFlag = Settings.getNSFWFlag();

    $scope.checkNSFW = function(){
      Settings.setNSFWFlag($scope.nsfwFlag);
    };

    $scope.addSubreddit = function(name) {
      alert("Should now be adding " + name);
    }

    $scope.removeSubreddit = function(name) {
      alert("Should now be removing " + name);
    }

    $scope.subreddits = RedditAPI.getSubreddits();
  }
    
  SettingsCtrl.$inject = ['$scope', 'Settings', 'RedditAPI'];

  return SettingsCtrl;

});

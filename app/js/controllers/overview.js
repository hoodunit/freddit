define(function () {
  'use strict';

  function OverviewCtrl($scope, RedditAPI, Settings) {
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

    // For settings drawer
    $scope.showSettingsDrawer = false;
    $scope.toggleSettingsDrawer = function () {
      $scope.showSettingsDrawer = !$scope.showSettingsDrawer;
    }

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

    $scope.install = function(name) {
      var manifest_url = "http://localhost:8081/manifest.webapp";
      var myapp = navigator.mozApps.install(manifest_url);
      myapp.onsuccess = function(data) {
      // App is installed, remove button
        
        //$scope.installed = true;
      };
      myapp.onerror = function() {
      // App wasn't installed, info is in
      // installapp.error.name
     };
    }

    $scope.subreddits = RedditAPI.getSubreddits();
  }

  OverviewCtrl.$inject = ['$scope', 'RedditAPI', 'Settings'];

  return OverviewCtrl;

});

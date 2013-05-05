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

    $scope.install = function(name) {
      alert("installing");
      //ev.preventDefault();
      // define the manifest URL
      var manifest_url = "http:0.0.0.0:8081/manifest.webapp";
      // install the app
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

  SettingsCtrl.$inject = ['$scope', 'Settings', 'RedditAPI'];

  return SettingsCtrl;

});

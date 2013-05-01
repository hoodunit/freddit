define(function () {
  'use strict';

  function SettingsCtrl($scope, Settings) {
    $scope.nsfwFlag = Settings.getNSFWFlag();

    $scope.checkNSFW = function(){
      Settings.setNSFWFlag($scope.nsfwFlag);
    };
  }
    
  SettingsCtrl.$inject = ['$scope', 'Settings'];

  return SettingsCtrl;

});

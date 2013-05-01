define(['angular', 'mocks'], function () {
  'use strict';

  describe('SettingsCtrl', function () {
    var scope;

    beforeEach(function () {
      module('controllers');

      inject(function($rootScope, $controller, Settings) {
        scope = $rootScope.$new();

        spyOn(Settings, 'getNSFWFlag').andReturn(false);
        spyOn(Settings, 'setNSFWFlag');

	$controller('SettingsCtrl', {
	  $scope: scope
	});
      });			
    });

    it('should initially set NFSW flag from Settings Service NSFW flag',
       inject(function(Settings){
      expect(Settings.getNSFWFlag).toHaveBeenCalled();
      expect(scope.nsfwFlag).toEqual(false);
    }));

    it('checkNSFW should update the Settings Service NSFW flag', inject(function(Settings){
      expect(scope.nsfwFlag).toEqual(false);
      scope.checkNSFW();
      expect(Settings.setNSFWFlag).toHaveBeenCalledWith(false);
      scope.nsfwFlag = true;
      scope.checkNSFW();
      expect(Settings.setNSFWFlag).toHaveBeenCalledWith(true);
    }));
  });
});

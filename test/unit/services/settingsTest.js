define(['angular', 'mocks', 'js/services/services'], function (angular, mocks, services) {beforeEach(function() {
    module('services');
  });

  describe('Settings', function() {
    it('should contain a Settings service', inject(function(Settings) {
      expect(Settings).not.toBe(null);
    }));

    describe('NSFW', function() {
      it('should set NSFW flag to false initially', inject(function(Settings) {
        expect(Settings.getNSFWFlag()).toEqual(false);
      }));
    });
  });
});


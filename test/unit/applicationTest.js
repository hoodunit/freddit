define(['angular'], function(angular) { 
  describe("Freddit: Testing Modules", function() {
    var appModule, dependencies;
    
    beforeEach(function () {
      appModule = angular.module("app");
      dependencies = appModule.requires;
    });
    
    it("should be registered", function() {    
      expect(appModule).not.toBeUndefined();
    });

    describe("Dependencies", function() {
      var hasModule = function(appModule) {
        return dependencies.indexOf(appModule) >= 0;
      };

      it("should have filters as a dependency", function() {
        expect(hasModule('filters')).toEqual(true);
      });

      it("should have services as a dependency", function() {
        expect(hasModule('services')).toEqual(true);
      });

      it("should have controllers as a dependency", function() {
        expect(hasModule('controllers')).toEqual(true);
      });

      it("should have directives as a dependency", function() {
        expect(hasModule('directives')).toEqual(true);
      });
    });
  });
});

define(['angular', 'mocks', 'js/services/services'], function (angular, mocks, services) {
  var app;

  beforeEach(function() {
    //app = angular.module("app");

    //app.factory(services);
    //angular.mock.module('app');
    module('services');
  });



  describe('RedditAPI', function() {
    it('should contain a RedditAPI service', inject(function(RedditAPI) {
      expect(RedditAPI).not.toBe(null);
    }));
    
    it('should open a new window to do an OAuth login', inject(function(RedditAPI) {
      console.log(RedditAPI);
      expect(RedditAPI).not.toBe(null);
    }));
  });

});


define(['angular', 'mocks', 'js/services/services'], function (angular, mocks, services) {
  beforeEach(function() {
    module('services');
  });

  describe('RedditAPI', function() {
    it('should contain a RedditAPI service', inject(function(RedditAPI) {
      expect(RedditAPI).not.toBe(null);
    }));

    describe('login', function() {

      it('should open a new window and set a listen event when logging in', inject(function(RedditAPI, $window) {
        spyOn($window, 'open');
        spyOn($window, 'addEventListener');
        RedditAPI.login(function(event){console.log('callback called');});
        expect($window.open).toHaveBeenCalled();
        expect($window.addEventListener).toHaveBeenCalled();
      }));
      
      it('should log user in when login succeeds', inject(function(RedditAPI) {
        var accessToken = 'testtoken';
        var origin = 'http://localhost:8081';
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': origin};

        RedditAPI.receiveAccessToken(function(){})(event);

        expect(RedditAPI.loggedIn()).toEqual(true);
      }));
      
      it('should not log user in when origin is invalid', inject(function(RedditAPI) {
        var accessToken = 'testtoken';
        var origin = 'invalid';
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': origin};

        RedditAPI.receiveAccessToken(function(){})(event);

        expect(RedditAPI.loggedIn()).toEqual(false);
      }));
    });

  });

});


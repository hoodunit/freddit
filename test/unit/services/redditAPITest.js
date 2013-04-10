define(['angular', 'mocks', 'js/services/services'], function (angular, mocks, services) {
  beforeEach(function() {
    module('services');
  });

  describe('RedditAPI', function() {
    it('should contain a RedditAPI service', inject(function(RedditAPI) {
      expect(RedditAPI).not.toBe(null);
    }));

    describe('login', function() {
      var VALID_ORIGIN = 'http://localhost:8081';

      it('should open a new window and listen for response messages', inject(function(RedditAPI, $window) {
        spyOn($window, 'open');
        spyOn($window, 'addEventListener');
        RedditAPI.login(function(event){console.log('callback called');});
        expect($window.open).toHaveBeenCalled();
        expect($window.addEventListener).toHaveBeenCalled();
      }));
      
      it('should log user in when it receives an access token', inject(function(RedditAPI) {
        var accessToken = 'testtoken';
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': VALID_ORIGIN};

        RedditAPI.receiveLoginResponse(function(){})(event);

        expect(RedditAPI.loggedIn()).toEqual(true);
      }));
      
      it('should not log user in when it receives empty data', inject(function(RedditAPI) {
        var event = {'data': {}, 'origin': VALID_ORIGIN};

        RedditAPI.receiveLoginResponse(function(){})(event);

        expect(RedditAPI.loggedIn()).toEqual(false);
      }));
      
      it('should not log user in when it receives an empty access token', inject(function(RedditAPI) {
        var data = {'access_token': ''};
        var event = {'data': data, 'origin': VALID_ORIGIN};

        RedditAPI.receiveLoginResponse(function(){})(event);

        expect(RedditAPI.loggedIn()).toEqual(false);
      }));
      
      it('should not log user in when origin is invalid', inject(function(RedditAPI) {
        var accessToken = 'testtoken';
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': 'invalid'};

        RedditAPI.receiveLoginResponse(function(){})(event);

        expect(RedditAPI.loggedIn()).toEqual(false);
      }));
      
      it('should not log user in when it receives an error', inject(function(RedditAPI) {
        var data = {'error': 'access_denied'};
        var event = {'data': data, 'origin': VALID_ORIGIN};

        RedditAPI.receiveLoginResponse(function(){})(event);

        expect(RedditAPI.loggedIn()).toEqual(false);
      }));
    });

    describe('logout', function() {
      it('should log the user out', inject(function(RedditAPI) {
        var accessToken = 'testtoken';
        var origin = 'http://localhost:8081';
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': origin};

        RedditAPI.receiveLoginResponse(function(){})(event);
        expect(RedditAPI.loggedIn()).toEqual(true);

        RedditAPI.logout(function(){});
        expect(RedditAPI.loggedIn()).toEqual(false);
      }));

      it('should call a callback function after logging the user out',
         inject(function(RedditAPI) {
        var accessToken = 'testtoken';
        var origin = 'http://localhost:8081';
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': origin};


        RedditAPI.receiveLoginResponse(function(){})(event);
        expect(RedditAPI.loggedIn()).toEqual(true);

        var callback = jasmine.createSpy();
        RedditAPI.logout(callback);
        expect(callback).toHaveBeenCalled();
      }));
    });

  });

});


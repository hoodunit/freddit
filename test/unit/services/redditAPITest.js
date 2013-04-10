define(['angular', 'mocks', 'js/services/services'], function (angular, mocks, services) {
  beforeEach(function() {
    module('services');
  });

  describe('RedditAPI', function() {
    var VALID_ORIGIN = 'http://localhost:8081';

    it('should contain a RedditAPI service', inject(function(RedditAPI) {
      expect(RedditAPI).not.toBe(null);
    }));

    describe('login', function() {
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
        var origin = VALID_ORIGIN;
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
        var origin = VALID_ORIGIN;
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': origin};


        RedditAPI.receiveLoginResponse(function(){})(event);
        expect(RedditAPI.loggedIn()).toEqual(true);

        var callback = jasmine.createSpy();
        RedditAPI.logout(callback);
        expect(callback).toHaveBeenCalled();
      }));
    });

    describe('getUsername', function() {
      var $httpBackend;
      var testUsername;
      var testUserData;

      beforeEach(inject(function($injector){
        $httpBackend = $injector.get('$httpBackend');
        testUsername = 'testuser';
        testUserData = {'name': testUsername};
        $httpBackend.when('GET', 'http://localhost:8081/oauth/api/v1/me').respond(testUserData);
      }));

      it('should return the resolved username promise if it already exists', inject(function(RedditAPI, $rootScope, $q) {
        var deferredTestUsername = $q.defer();
        var testUsernamePromise = deferredTestUsername.promise;
        
        RedditAPI.username = deferredTestUsername;
        var receivedUsernamePromise = RedditAPI.getUsername();
        expect(receivedUsernamePromise).toEqual(testUsernamePromise);
      }));

      it('should return a promise and fetch the username if it does not exist',
         inject(function(RedditAPI, $rootScope) {
        expect(RedditAPI.username).toEqual(null);

        $httpBackend.expectGET('http://localhost:8081/oauth/api/v1/me');
        var usernamePromise = RedditAPI.getUsername();
        var resolvedUsername;
        usernamePromise.then(function(value){resolvedUsername = value;});
        expect(resolvedUsername).toBeUndefined();

        $httpBackend.flush();
        expect(resolvedUsername).toEqual(testUsername);
      }));
    });

  });

});


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
      beforeEach(inject(function(RedditAPI){
        spyOn(RedditAPI, 'fetchUsername');
      }));

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
      
      it('should fetch username after logging in', inject(function(RedditAPI) {
        var accessToken = 'testtoken';
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': VALID_ORIGIN};

        RedditAPI.receiveLoginResponse(function(){})(event);

        expect(RedditAPI.fetchUsername).toHaveBeenCalled();
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
      beforeEach(inject(function(RedditAPI){
        spyOn(RedditAPI, 'fetchUsername');
      }));

      it('should set the user to logged out', inject(function(RedditAPI) {
        var accessToken = 'testtoken';
        var origin = VALID_ORIGIN;
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': origin};

        RedditAPI.receiveLoginResponse(function(){})(event);
        expect(RedditAPI.loggedIn()).toEqual(true);

        RedditAPI.logout(function(){});
        expect(RedditAPI.loggedIn()).toEqual(false);
      }));

      it('should clear the username', inject(function(RedditAPI, $q) {
        var accessToken = 'testtoken';
        var origin = VALID_ORIGIN;
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': origin};

        var origUsername = $q.defer();
        RedditAPI.username = origUsername;

        RedditAPI.receiveLoginResponse(function(){})(event);
        expect(RedditAPI.loggedIn()).toEqual(true);
        expect(RedditAPI.username).toEqual(origUsername);


        RedditAPI.logout(function(){});
        expect(RedditAPI.username).toNotEqual(origUsername);
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

    describe('fetchUsername', function() {
      var $httpBackend;
      var testUsername;
      var testUserData;

      beforeEach(inject(function($injector){
        $httpBackend = $injector.get('$httpBackend');
        testUsername = 'testuser';
        testUserData = {'name': testUsername};
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should call server and resolve the username promise after receiving username', inject(function(RedditAPI, $q) {
        $httpBackend.expectGET('http://localhost:8081/oauth/api/v1/me')
          .respond(testUserData);

        var deferredTestUsername = $q.defer();
        var testUsernamePromise = deferredTestUsername.promise;
        var username;
        testUsernamePromise.then(function(value){username = value;});

        RedditAPI.username = deferredTestUsername;
        
        RedditAPI.fetchUsername();
        $httpBackend.flush();
        expect(username).toEqual(testUsername);
      }));
    });

  });

});


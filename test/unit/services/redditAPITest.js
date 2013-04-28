define(['angular', 'mocks', 'js/services/services'], function (angular, mocks, services) {
  beforeEach(function() {
    module('services');
  });

  describe('RedditAPI', function() {
    var VALID_ORIGIN = 'http://localhost:8081';

    it('should contain a RedditAPI service', inject(function(RedditAPI) {
      expect(RedditAPI).not.toBe(null);
    }));

    describe('subreddits', function() {
      var DEFAULT_SUBREDDITS = ['pics', 'mapporn', 'aww', 'cityporn', 'lolcats', 'corgi'];
      var userSubreddits = ['pics', 'mapporn'];
      
      it('should initially set subreddits to default subreddits', inject(function(RedditAPI) {
        expect(RedditAPI.getSubredditNames()).toEqual(DEFAULT_SUBREDDITS);
      }));
    });

    describe('login', function() {
      beforeEach(inject(function(RedditAPI){
        spyOn(RedditAPI, 'fetchUsername');
        spyOn(RedditAPI, 'loadUserSubredditNames');
      }));

      it('should open a new window and listen for response messages', inject(function(RedditAPI, $window) {
        spyOn($window, 'open');
        spyOn($window, 'addEventListener');
        RedditAPI.login(function(event){});
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
      
      it('should load user subreddit names after logging in',
         inject(function(RedditAPI) {

        var accessToken = 'testtoken';
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': VALID_ORIGIN};

        RedditAPI.receiveLoginResponse(function(){})(event);
        expect(RedditAPI.loadUserSubredditNames).toHaveBeenCalled();
      }));
    });

    describe('logout', function() {
      beforeEach(inject(function(RedditAPI){
        spyOn(RedditAPI, 'fetchUsername');
        spyOn(RedditAPI, 'loadUserSubredditNames');
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

    describe('loadUserSubredditNames', function() {
      var $httpBackend;

      beforeEach(inject(function($injector){
        $httpBackend = $injector.get('$httpBackend');
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should call server to fetch user subreddit names and save them', inject(function(RedditAPI) {

        var userSubreddits = ['pics', 'mapporn'];
        var userSubredditData = {'data': {'children':
                                          [{'data': {'display_name': 'pics'}},
                                           {'data': {'display_name': 'mapporn'}}]}};
        $httpBackend.expectGET('http://localhost:8081/oauth/subreddits/mine/subscriber.json')
          .respond(userSubredditData);

        RedditAPI.loadUserSubredditNames(function(){});
        $httpBackend.flush();
        expect(RedditAPI.subredditNames).toEqual(userSubreddits);
      }));
    });

   describe('extractDirectImageLink', function() {
     it('should return null for these', inject(function(RedditAPI) {
       var testcases = [
         'http://www.google.com/',
         'https://www.google.com/',
         'http://imgur.com/QWER',
         'http://imgur.com/gallery/QWER',
         'http://imgur.com/a/QWER',
         'http://imgur.com/QWER.jpg',
         'http://tumblr.com/test',
         'http://flickr.com/qwer/qwer',
         'http://www.flickr.com/photos/test/54321/in/set-123',
         ];
       for (var i = 0;i < testcases.length;i ++) {
         var output = RedditAPI.extractDirectImageLink(testcases[i]);
         expect(output).toEqual(null);
       }
     }));
     it('should return url for these', inject(function(RedditAPI) {
       var testcases = [
         'http://i.imgur.com/QWER.jpg',
         'http://sphotos-d.ak.fbcdn.net/hphotos-ak-ash3/1234_1234_1234.jpg',
         'http://25.media.tumblr.com/baf27/tumblr_qwer_400.jpg',
         'http://tumblr.com/test.png',
         'http://i.chzbgr.com/qwer',
         'http://farm2.staticflickr.com/2233/56424_3ddea_z.jpg',
         'www.somewhere.com/test.png',
         'null.xx/abc.gif',
         'asdf/qwer.jpg',
         ];
       for (var i = 0;i < testcases.length;i ++) {
         var output = RedditAPI.extractDirectImageLink(testcases[i]);
         expect(output).toEqual(testcases[i]);
       }
     }));
   });

   describe('getSubredditFirstImageUrl', function() {
     var $httpBackend;

     beforeEach(inject(function($injector){
       $httpBackend = $injector.get('$httpBackend');
     }));

     afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
     });

     var REDDIT_URL = 'http://reddit.com';
     var FIRST_IMAGE_SPECULATIVE_SIZE = 10; 
     var DEFAULT_IMAGE_URL = 'http://www.redditstatic.com/icon.png';

     it('a result with no good image url should return default url', inject(function(RedditAPI) {
       var answer = {'data':{'children':[ {'data':{'url': ''}} ] }};
       $httpBackend.expectJSONP(REDDIT_URL + '/r/test/new.json?jsonp=JSON_CALLBACK&obey_over18=true&limit=' + FIRST_IMAGE_SPECULATIVE_SIZE).respond(answer);
       var deferredOutput = RedditAPI.getSubredditFirstImageUrl('test');
       $httpBackend.flush();
       deferredOutput.then(function(value){
         expect(value).toEqual(DEFAULT_IMAGE_URL);
        });
     }));

     it('a result with a good image url should return the url', inject(function(RedditAPI) {
       var url = DEFAULT_IMAGE_URL;
       var answer = {'data':{'children':[ {'data':{'url': url}} ] }};
       $httpBackend.expectJSONP(REDDIT_URL + '/r/test/new.json?jsonp=JSON_CALLBACK&obey_over18=true&limit=' + FIRST_IMAGE_SPECULATIVE_SIZE).respond(answer);
       var deferredOutput = RedditAPI.getSubredditFirstImageUrl('test');
       $httpBackend.flush();
       deferredOutput.then(function(value){
         expect(value).toEqual(url);
        });
     }));
   });


  });

});


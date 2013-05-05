define(['angular', 'mocks', 'js/services/services'], function (angular, mocks, services) {beforeEach(function() {
    module('services');
  });

  describe('RedditAPI', function() {
    var VALID_ORIGIN = 'http://localhost:8081';
    var DEFAULT_SUBREDDITS = ['pics', 'mapporn', 'aww', 'cityporn', 'lolcats', 'corgi'];

    it('should contain a RedditAPI service', inject(function(RedditAPI) {
      expect(RedditAPI).not.toBe(null);
    }));

    describe('getSubreddits', function() {
      var $httpBackend;

      beforeEach(inject(function(RedditAPI, $injector){
        $httpBackend = $injector.get('$httpBackend');

        for(var i = 0; i < DEFAULT_SUBREDDITS.length; i++){
          var url = 'http://reddit.com/r/'
            + DEFAULT_SUBREDDITS[i]
            + '/new.json?jsonp=JSON_CALLBACK&obey_over18=true&limit=10';
          $httpBackend.when('JSONP', url).respond(null);
        }

        spyOn(RedditAPI, 'loadSubreddits').andCallThrough();
      }));

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
      });
      
      it('should load and return default subreddits if not logged in',
         inject(function(RedditAPI) {
        var subreddits = RedditAPI.getSubreddits();
        for(var i = 0; i < subreddits.length; i++){
          expect(subreddits[i]['name']).toEqual(DEFAULT_SUBREDDITS[i]);
        }
        expect(RedditAPI.loadSubreddits).toHaveBeenCalled();
      }));
      
      it('should return default subreddits without loading if already loaded',
         inject(function(RedditAPI) {
        spyOn(RedditAPI, 'subreddits').andReturn(DEFAULT_SUBREDDITS);
        var subreddits = RedditAPI.getSubreddits();
        expect(RedditAPI.loadSubreddits).not.toHaveBeenCalled();
      }));

      it('should return user subreddits if logged in', inject(function(RedditAPI) {
        var userSubreddits = ['mapporn', 'corgi'];
        spyOn(RedditAPI, 'subredditNames').andReturn(userSubreddits);

        var subreddits = RedditAPI.getSubreddits();
        for(var i = 0; i < subreddits.length; i++){
          expect(subreddits[i]['name']).toEqual(userSubreddits[i]);
        }
      }));
    });

    describe('login', function() {
      beforeEach(inject(function(RedditAPI){
        spyOn(RedditAPI, 'fetchUsername');
        spyOn(RedditAPI, 'getUserSubredditNames');
      }));

      it('should open a new window and listen for response messages', inject(function(RedditAPI, $window) {
        spyOn($window, 'open');
        spyOn($window, 'addEventListener');
        RedditAPI.login(function(event){});
        expect($window.open).toHaveBeenCalled();
        expect($window.addEventListener).toHaveBeenCalled();
      }));
      
      it('should log user in when it receives a valid access token',
         inject(function(RedditAPI) {
        var accessToken = 'testtoken';
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': VALID_ORIGIN};
        var callback = jasmine.createSpy();

        RedditAPI.receiveLoginResponse(callback)(event);

        expect(RedditAPI.loggedIn()).toEqual(true);
      }));
      
      it('should fetch username and subreddits after logging in', inject(function(RedditAPI) {
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
        spyOn(RedditAPI, 'getUserSubredditNames');
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

      it('should reset loaded subreddits to defaults', inject(function(RedditAPI, $q) {
        var accessToken = 'testtoken';
        var origin = VALID_ORIGIN;
        var data = {'access_token': accessToken};
        var event = {'data': data, 'origin': origin};

        var origUsername = $q.defer();
        RedditAPI.username = origUsername;

        RedditAPI.receiveLoginResponse(function(){})(event);
        expect(RedditAPI.loggedIn()).toEqual(true);
        expect(RedditAPI.username).toEqual(origUsername);

        RedditAPI.subredditNames = ['testname1', 'testname2'];
        RedditAPI.subreddits = RedditAPI.subredditNames;

        RedditAPI.logout(function(){});
        expect(RedditAPI.subredditNames).toEqual(DEFAULT_SUBREDDITS);
        expect(RedditAPI.subreddits).toEqual(null);
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

    describe('getUserSubredditNames', function() {
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

        RedditAPI.getUserSubredditNames(function(){});
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

     var FIRST_IMAGE_SPECULATIVE_SIZE = 10; 
     var DEFAULT_IMAGE_URL = 'http://www.redditstatic.com/icon.png';
     var REQUEST_URL = 'http://reddit.com/r/test/new.json?jsonp=JSON_CALLBACK&obey_over18=true&limit=' + FIRST_IMAGE_SPECULATIVE_SIZE;

     it('a result with no good image url should return default url', inject(function(RedditAPI, $rootScope) {
       var answer = {'data':{'children':[ {'data':{'url': ''}} ] }};
       $httpBackend.expectJSONP(REQUEST_URL).respond(answer);
       var deferredOutputPromise = RedditAPI.getSubredditFirstImageUrl('test');
       $httpBackend.flush();
       var output;
       deferredOutputPromise.then(function(value){ output = value; });
       $rootScope.$apply();
       expect(output).toEqual(DEFAULT_IMAGE_URL);
     }));

     it('a result with a good image url should return the url', inject(function(RedditAPI, $rootScope) {
       var testUrl = DEFAULT_IMAGE_URL;
       var answer = {'data':{'children':[ {'data':{'url': testUrl}} ] }};
       $httpBackend.expectJSONP(REQUEST_URL).respond(answer);
       var deferredOutputPromise = RedditAPI.getSubredditFirstImageUrl('test');
       $httpBackend.flush();
       var output;
       deferredOutputPromise.then(function(value){ output = value; });
       $rootScope.$apply();
       expect(output).toEqual(testUrl);
     }));

     it('a failed Reddit fetch should return default url', inject(function(RedditAPI, $rootScope) {
       $httpBackend.expectJSONP(REQUEST_URL).respond(500, '');
       var deferredOutputPromise = RedditAPI.getSubredditFirstImageUrl('test');
       $httpBackend.flush();
       var output;
       deferredOutputPromise.then(function(value){ output = value; });
       $rootScope.$apply();
       expect(output).toEqual(DEFAULT_IMAGE_URL);
     }));

     it('should obey NSFW flag', inject(function(RedditAPI, $rootScope, Settings) {
       var REQUEST_URL_SHOW_NSFW = 'http://reddit.com/r/test/new.json?jsonp=JSON_CALLBACK&obey_over18=false&limit=' + FIRST_IMAGE_SPECULATIVE_SIZE;

       spyOn(Settings, 'getNSFWFlag').andReturn(false);
       $httpBackend.expectJSONP(REQUEST_URL).respond(500, '');
       RedditAPI.getSubredditFirstImageUrl('test');
       $httpBackend.flush();

       Settings.getNSFWFlag.andReturn(true);
       $httpBackend.expectJSONP(REQUEST_URL_SHOW_NSFW).respond(500, '');
       RedditAPI.getSubredditFirstImageUrl('test');
       $httpBackend.flush();
     }));
   });


   describe('getSubredditPosts', function() {
     var $httpBackend;
     var REQUEST_URL = 'http://reddit.com/r/test.json?jsonp=JSON_CALLBACK&obey_over18=true&sort=hot';

     beforeEach(inject(function($injector){
       $httpBackend = $injector.get('$httpBackend');
     }));

     afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
     });

     it('a correct subreddit name gives a set of posts', inject(function(RedditAPI,$rootScope) {
       var testUrl = 'http://somewhere/test.jpg';
       var answer = {'data':{'children':[ {'data':{
         'url': testUrl,
         'id': 0,
         'title': 'text'  }} ] }};
       $httpBackend.expectJSONP(REQUEST_URL).respond(answer);
       var deferredOutputPromise = RedditAPI.getSubredditPosts('test');
       $httpBackend.flush();
       var output;
       deferredOutputPromise.then(function(value) { output = value; });
       $rootScope.$apply();
       expect(output).toEqual([{'id':0, 'url': testUrl, 'title':'text'}]);
     }));

     it('a failed fetch should break the promise', inject(function(RedditAPI,$rootScope) {
       $httpBackend.expectJSONP(REQUEST_URL).respond(500, '');
       var deferredOutputPromise = RedditAPI.getSubredditPosts('test');
       $httpBackend.flush();
       var output;
       deferredOutputPromise.then(function(value) { output = 'NOT_BROKEN'; },
                                  function(value) { output = 'BROKEN'; });
       $rootScope.$apply();
       expect(output).toEqual('BROKEN');
     }));
   });

   describe('getSubredditPostsSortedBy', function() {
     var $httpBackend;
     var REQUEST_URL = 'http://reddit.com/r/test.json?jsonp=JSON_CALLBACK&obey_over18=true&sort=new';

     beforeEach(inject(function($injector){
       $httpBackend = $injector.get('$httpBackend');
     }));

     afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
     });

     it('should obey NSFW flag', inject(function(RedditAPI, $rootScope, Settings) {
       var REQUEST_URL_SHOW_NSFW = 'http://reddit.com/r/test.json?jsonp=JSON_CALLBACK&obey_over18=false&sort=new';
       var REQUEST_URL_NOSHOW_NSFW = 'http://reddit.com/r/test.json?jsonp=JSON_CALLBACK&obey_over18=true&sort=new';
       var testPost = {'url': 'http://somewhere/test.jpg',
                       'id': 0,
                       'title': 'text',
                       'over_18': false};
       var testParsedPost = {'url': 'http://somewhere/test.jpg',
                             'id': 0,
                             'title': 'text'};
       var testNSFWPost = {'url': 'http://somewhere/test.jpg',
                           'id': 0,
                           'title': 'text',
                           'over_18': true};
       var testParsedNSFWPost = {'url': 'http://somewhere/test.jpg',
                                 'id': 0,
                                 'title': 'text'};
       var testData = [{'data': testPost}];
       var testNSFWData = [{'data': testPost}, {'data': testNSFWPost}];
       var testDataResponse = {'data': {'children': testData}};
       var testNSFWDataResponse = {'data': {'children': testNSFWData}};

       var expectedSafePosts = [testParsedPost];
       var expectedNSFWPosts = [testParsedPost, testParsedNSFWPost];

       spyOn(Settings, 'getNSFWFlag').andReturn(false);
       $httpBackend.expectJSONP(REQUEST_URL).respond(testDataResponse);
       var deferredOutputPromise = RedditAPI.getSubredditPostsSortedBy('test', 'new');
       $httpBackend.flush();
       var output;
       deferredOutputPromise.then(function(value) { output = value; });
       $rootScope.$apply();
       expect(output).toEqual(expectedSafePosts);

       Settings.getNSFWFlag.andReturn(false);
       $httpBackend.expectJSONP(REQUEST_URL).respond(testNSFWDataResponse);
       var deferredOutputPromise = RedditAPI.getSubredditPostsSortedBy('test', 'new');
       $httpBackend.flush();
       var output;
       deferredOutputPromise.then(function(value) { output = value; });
       $rootScope.$apply();
       expect(output).toEqual(expectedSafePosts);

       Settings.getNSFWFlag.andReturn(true);
       $httpBackend.expectJSONP(REQUEST_URL_NOSHOW_NSFW).respond(testDataResponse);
       var deferredOutputPromise = RedditAPI.getSubredditPostsSortedBy('test', 'new');
       $httpBackend.flush();
       var output;
       deferredOutputPromise.then(function(value) { output = value; });
       $rootScope.$apply();
       expect(output).toEqual(expectedSafePosts);

       Settings.getNSFWFlag.andReturn(true);
       $httpBackend.expectJSONP(REQUEST_URL_NOSHOW_NSFW).respond(testNSFWDataResponse);
       var deferredOutputPromise = RedditAPI.getSubredditPostsSortedBy('test', 'new');
       $httpBackend.flush();
       var output;
       deferredOutputPromise.then(function(value) { output = value; });
       $rootScope.$apply();
       expect(output).toEqual(expectedNSFWPosts);
     }));
   });

   describe('NSFW flag', function() {
     it('getNSFWString should return proper string based on Settings NSFW flag',
        inject(function(RedditAPI, Settings) {
        var SHOW_NSFW = "obey_over18=false";
        var HIDE_NSFW = "obey_over18=true";
        spyOn(Settings, 'getNSFWFlag').andReturn(false);
        expect(RedditAPI.getNSFWString()).toEqual(HIDE_NSFW);
        Settings.getNSFWFlag.andReturn(true);
        expect(RedditAPI.getNSFWString()).toEqual(SHOW_NSFW);
     }));
   });

  });

});


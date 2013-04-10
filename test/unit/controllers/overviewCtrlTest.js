define(['angular', 'mocks'], function () {
  'use strict';

  describe('OverviewCtrl', function () {
    var scope;
    var username = 'test_user';
    var defaultSubredditNames = ['pics', 'mapporn', 'aww', 'cityporn', 'lolcats', 'corgi'];
    var defaultSubreddits = [{'name': 'pics', 'first_image_url': 'url'},
                             {'name': 'mapporn', 'first_image_url': 'url'},
                             {'name': 'aww', 'first_image_url': 'url'},
                             {'name': 'cityporn', 'first_image_url': 'url'},
                             {'name': 'lolcats', 'first_image_url': 'url'},
                             {'name': 'corgi', 'first_image_url': 'url'}];
    var userSubredditNames = ['pics', 'mapporn', 'corgi'];
    var userSubreddits = [{'name': 'pics', 'first_image_url': 'url'},
                          {'name': 'mapporn', 'first_image_url': 'url'},
                          {'name': 'corgi', 'first_image_url': 'url'}];

    beforeEach(function () {
      module('controllers');
      
      inject(function($rootScope, $controller, RedditAPI) {
        scope = $rootScope.$new();

        spyOn(RedditAPI, 'getSubredditFirstImageUrl').andReturn('url');
        RedditAPI.login = function(callback){callback(true);};
        spyOn(RedditAPI, 'login').andCallThrough();
        RedditAPI.loadUserSubreddits = function(callback){callback(userSubredditNames);};
        spyOn(RedditAPI, 'loadUserSubreddits').andCallThrough();
        spyOn(RedditAPI, 'getUsername').andReturn(username);

	$controller('OverviewCtrl', {
	  $scope : scope,
          DEFAULT_SUBREDDITS: defaultSubredditNames
	});
      });			
    });

    it('should set subreddits first based on the default list', function () {
      expect(scope.subreddits).toEqual(defaultSubreddits);
    });

    describe('login', function () {
      it('should set loggedIn to RedditAPI.loggedIn', inject(function (RedditAPI) {
        expect(scope.loggedIn).toEqual(RedditAPI.loggedIn);
      }));

      it('should call the RedditAPI to login', inject(function (RedditAPI) {
        scope.login();
        expect(RedditAPI.login).toHaveBeenCalled();
      }));

      it('should initially have a null user name', function () {
        expect(scope.username).toEqual(null);
      });

      it('should set the user name after logging in', function () {
        scope.login();
        expect(scope.username).toEqual(username);
      });

      it('should load user subreddits after logging in', function () {
        scope.login();
        expect(scope.subreddits).toEqual(userSubreddits);
      });

      it('should not change the user name if login fails', inject(function (RedditAPI) {
        RedditAPI.login = function(callback){};
        scope.login();
        expect(scope.username).toEqual(null);
      }));

      it('should not load user subreddits if login fails', inject(function (RedditAPI) {
        RedditAPI.login = function(callback){};
        scope.login();
        expect(RedditAPI.loadUserSubreddits).not.toHaveBeenCalled();
      }));
    });
  });
});

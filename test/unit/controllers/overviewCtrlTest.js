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
        spyOn(RedditAPI, 'getUsername').andReturn(username);
        spyOn(RedditAPI, 'getSubreddits').andReturn(defaultSubreddits);

	$controller('OverviewCtrl', {
	  $scope : scope
	});
      });			
    });

    it('should load subreddits from RedditAPI', inject(function(RedditAPI) {
      expect(scope.subreddits).toEqual(RedditAPI.getSubreddits());
    }));

    it('should set username from RedditAPI', inject(function(RedditAPI){
      expect(scope.username).toEqual(RedditAPI.getUsername());
    }));

    describe('login', function () {
      it('should set loggedIn to RedditAPI.loggedIn', inject(function (RedditAPI) {
        expect(scope.loggedIn).toEqual(RedditAPI.loggedIn);
      }));

      it('should call the RedditAPI to login', inject(function (RedditAPI) {
        scope.login();
        expect(RedditAPI.login).toHaveBeenCalled();
      }));

      it('should load user subreddits after logging in', inject(function (RedditAPI) {
        expect(scope.subreddits).toEqual(defaultSubreddits);
        RedditAPI.getSubreddits.andReturn(userSubreddits);
        scope.login();
        expect(scope.subreddits).toEqual(userSubreddits);
      }));

      it('should not load user subreddits if login fails', inject(function (RedditAPI) {
        expect(scope.subreddits).toEqual(defaultSubreddits);
        RedditAPI.login = function(callback){};
        scope.login();
        expect(scope.subreddits).toEqual(defaultSubreddits);
      }));
    });
  });
});

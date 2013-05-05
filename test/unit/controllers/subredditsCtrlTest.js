define(['angular', 'mocks'], function () {
  'use strict';

  describe('SubredditsCtrl', function () {
    var scope;

    var post1 = {'id': '1', 'url': 'asdf', 'title': 'mytitle'};
    var post2 = {'id': '1', 'url': 'asdf', 'title': 'mytitle'};
    var subredditPosts = [post1, post2];
    var subredditName = 'lolcats';

    beforeEach(function () {
      module('controllers');

      inject(function($rootScope, $controller, RedditAPI, $q) {
        scope = $rootScope.$new();
        var posts = $q.defer();
        posts.resolve(subredditPosts);
        spyOn(RedditAPI, 'getSubredditPosts').andCallThrough();
        spyOn(RedditAPI, 'getSubredditPostsSortedBy').andReturn(posts.promise);

	$controller('SubredditsCtrl', {
	  $scope: scope,
          $routeParams: {id: subredditName, order: "some"}
	});
      });			
    });

    it('should set subredditName from route URL', function(){
      expect(scope.subredditName).toEqual(subredditName);
    });

    it('should fetch the latest lolcats posts', inject(function(RedditAPI) {
      expect(RedditAPI.getSubredditPosts).toHaveBeenCalledWith(subredditName, 0);
    }));
  });
});

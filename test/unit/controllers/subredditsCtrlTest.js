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

      inject(function($rootScope, $controller, RedditAPI) {
        scope = $rootScope.$new();

        spyOn(RedditAPI, 'getSubredditPosts').andReturn(subredditPosts);

	$controller('SubredditsCtrl', {
	  $scope: scope,
          $routeParams: {id: subredditName}
	});
      });			
    });

    it('should set subredditName from route URL', function(){
      expect(scope.subredditName).toEqual(subredditName);
    });

    it('should fetch the latest lolcats posts', inject(function(RedditAPI) {
      expect(RedditAPI.getSubredditPosts).toHaveBeenCalledWith(subredditName);
      expect(scope.posts).toEqual(subredditPosts);
    }));
  });
});

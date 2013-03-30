define(['angular', 'mocks'], function () {
  'use strict';

  describe('SubredditsCtrl', function () {
    var scope;

    var post1 = {'id': '1', 'url': 'asdf', 'title': 'mytitle'};
    var post2 = {'id': '1', 'url': 'asdf', 'title': 'mytitle'};
    var subredditPosts = [post1, post2];

    beforeEach(function () {
      module('controllers', 'services');

      inject(function($rootScope, $controller, RedditAPI) {
        scope = $rootScope.$new();

        RedditAPI.getSubredditPosts = function(){ return subredditPosts;};

	$controller('SubredditsCtrl', {
	  $scope: scope,
          $routeParams: {id: 'lolcats'}
	});
      });			
    });

    it('should set subredditName from route URL', function(){
      expect(scope.subredditName).toEqual('lolcats');
    });

    it('should fetch the latest lolcats posts', function() {
      expect(scope.posts).toEqual(subredditPosts);
    });
  });
});

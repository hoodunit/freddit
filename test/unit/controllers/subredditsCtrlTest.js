define(['angular', 'mocks'], function () {
  'use strict';

  describe('SubredditsCtrl', function () {
    var scope, $httpBackend;
    var subredditPosts = [{data: {title: 'postTitle', url: 'url'}}];
    var subredditResponse = {data: {children: subredditPosts}};

    beforeEach(function () {
      module('controllers');
      
      inject(function(_$httpBackend_, $rootScope, $controller) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectJSONP(
          'http://reddit.com/r/lolcats.json?jsonp=JSON_CALLBACK').
          respond(subredditResponse);

        scope = $rootScope.$new();
	$controller('SubredditsCtrl', {
	  $scope : scope
	});
      });			
    });

    it('should fetch the latest lolcats posts', function () {
      expect(scope.posts).toEqual([]);
      $httpBackend.flush();

      expect(scope.posts).toEqual(subredditPosts);
    });
  });
});

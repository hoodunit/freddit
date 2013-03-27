define(function () {
  'use strict';

  function SubredditsCtrl($scope, $routeParams, $location, $http) {
    $scope.posts = [];
    $scope.page_title = $routeParams.id;
    $http.jsonp('http://reddit.com/r/' + $routeParams.id + '.json?jsonp=JSON_CALLBACK').
      success(function(data){
        for (var i in data.data.children)
        {
          // quick hack to show pics linking to imgur url instead of the picture
          var post = data.data.children[i];
          var url = post.data.url;
          if (url.indexOf("imgur") >= 0 && url.indexOf("http://i.") < 0)
          {
              // everything is .jpg, right?
              data.data.children[i].data.url = url + ".jpg";
          }
        }
        $scope.posts = data.data.children;
      });
  }

  SubredditsCtrl.$inject = ['$scope', '$routeParams', '$location', '$http'];

  return SubredditsCtrl;
});

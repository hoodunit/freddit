define(function () {
  'use strict';

  function SubredditsCtrl($scope, $routeParams, $location, $http) {
    $scope.posts = [];
    $http.jsonp('http://reddit.com/r/' + $routeParams.id + '.json?jsonp=JSON_CALLBACK').
      success(function(data){
        console.log('BEGIN, data length: '+data.data.children.length);
        var new_set = Array ();
        for (var i in data.data.children)
        {
          var this_entry = data.data.children[i];
          var direct_link = extract_direct_link(this_entry.data.url);
          if (direct_link === false) {
            console.log('FALSE');
          } else {
            this_entry.data.url = direct_link;
            new_set.push(this_entry);
          }
        }
        console.log('END, data length: '+new_set.length);
        $scope.posts = new_set;
        $scope.page_title = $routeParams.id;
      });
  }

  // returns false if unsuccessful
  //         string of direct link if success
  function extract_direct_link($url) {
    var res;
    console.log('URL: '+$url);
    // TODO: heuristic: everything that ends with .gif/.jpg/.png are direct links ?!

    // imgur
    if (res = /(.*)imgur.com\/(.*)/.exec($url)) {
      if (/i\./.exec(res[1])) {
        return $url;
      }
      // TODO: other kinds of imgur source ?
      return false;
    }
    // fbcdn
    if (res = /(.*)fbcdn(.*)\/(.*)\.(.*)/.exec($url)) {
      return $url;
    }
    return false;
  }

  SubredditsCtrl.$inject = ['$scope', '$routeParams', '$location', '$http'];

  return SubredditsCtrl;
});

define(function () {
  'use strict';

  function OverviewCtrl($scope, $routeParams, $location, $http, User) {
    var DEFAULT_SUBREDDITS = ['pics', 'mapporn', 'aww', 'cityporn', 'lolcats', 'corgi'];

    $scope.loggedIn = User.loggedIn;
    $scope.login = function(){
      User.login(function(){
        $scope.$apply();
        $scope.loadUserSubreddits();
      });
    };

    $scope.logout = function(){
      User.logout(function(){
        $scope.loadSubreddits(DEFAULT_SUBREDDITS);
      });
    }

    $scope.userName = null;

    $scope.loadUserSubreddits = function(){
      $scope.userName = User.getUserName();
      
      var url = 'http://localhost:8081/oauth/subreddits/mine/subscriber.json';
      var headers = {'Authorization': 'bearer ' + User.accessToken()};

      $http.get(url, {headers: headers}).success(function(subscribedData){
        var subredditsData = subscribedData.data.children;
        var subreddits = [];
        for(var i = 0; i < subredditsData.length; i++){
          subreddits.push(subredditsData[i].data.display_name);
        }
        $scope.loadSubreddits(subreddits);
      });
    }

    $scope.loadSubreddits = function(subreddits){
      $scope.subreddits = [];
      for(var i = 0, subredditName; subredditName = subreddits[i]; i++){
        var url = 'http://reddit.com/r/' + subredditName + '/new.json?jsonp=JSON_CALLBACK';
        $http.jsonp(url).success(function(data){
          var firstPost = data.data.children[0];
          var subreddit = {'name': firstPost.data.subreddit,
                           'first_post_url': firstPost.data.url};
          $scope.subreddits.push(subreddit);
        });
      }
    }

    $scope.loadSubreddits(DEFAULT_SUBREDDITS);
  }

  OverviewCtrl.$inject = ['$scope', '$routeParams', '$location', '$http', 'User'];

  return OverviewCtrl;

});

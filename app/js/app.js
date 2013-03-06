define(['angular', 'js/services/services', 'js/directives/directives',
        'js/providers/providers', 'js/filters/filters', 'js/controllers/controllers'],

       function(angular) {
         'use strict';

         var app = angular.module('app',
                                  ['mobile-navigate',
                                   'services',
                                   'directives',
                                   'providers',
                                   'filters',
                                   'controllers'])
           .config(['$routeProvider', function($routeProvider) {
                 $routeProvider
                   .when('/', {
                     templateUrl: 'views/overview.html',
                     controller: 'OverviewCtrl'
                   })
                   .when('/r/:id', {
                     templateUrl: 'views/subreddits.html',
                     controller: 'SubredditsCtrl'
                   })
                   .when('/post/:id', {
                     templateUrl: 'views/post.html',
                     controller: 'PostCtrl'
                   })
                   .otherwise({
                     redirectTo: '/'
                   });
               }])
               .run(function($templateCache, $http) {
                 // Loaded into cache on app startup
                 [
                 	'views/overview.html',
                   'views/post.html',
                   'views/subreddits.html'
                   
                 ].forEach(function(path) {
                   $http.get(path, { cache: $templateCache });
                 });
               });

         app.controller('MainCtrl', function($scope, $navigate) {
           $scope.$navigate = $navigate;
           $navigate.go((window.location.hash || '#/').substr(1), 'none');
         });
         
         // TouchStart is faster than click, that's why we add this here as a 
         // directive. Use `ng-tap` in code rather than `ng-click`.
         app.directive('ngTap', function() {
           var isTouch = !!('ontouchstart' in window);
           return function(scope, elm, attrs) {
             // if there is no touch available, we'll fall back to click
             if (isTouch) {
               var tapping = false;
               elm.bind('touchstart', function() {
                 tapping = true;
               });
               // prevent firing when someone is f.e. dragging
               elm.bind('touchmove', function() {
                 tapping = false;
               });
               elm.bind('touchend', function() {
                 tapping && scope.$apply(attrs.ngTap);
               });
             }
             else {
               elm.bind('click', function() {
                 scope.$apply(attrs.ngTap);
               });
             }
           };
         });
         
         return app;
});

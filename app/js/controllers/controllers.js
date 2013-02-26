/**
 * Base controller. New controllers need to be registered here.
 **/ 

define(['angular', 'js/controllers/subreddits', 'js/controllers/post'], 
       function (angular, SubredditsCtrl, PostCtrl) {
 	 var controllers = angular.module('controllers', ['services']);

 	 controllers.controller('SubredditsCtrl', SubredditsCtrl);
 	 controllers.controller('PostCtrl', PostCtrl);

 	 return controllers;
});

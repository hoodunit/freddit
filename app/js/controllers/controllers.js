/**
 * Base controller. New controllers need to be registered here.
 **/ 

define(['angular', 'js/controllers/subreddits'], 
       function (angular, SubredditsCtrl) {
 	 var controllers = angular.module('controllers', ['services']);

 	 controllers.controller('SubredditsCtrl', SubredditsCtrl);

 	 return controllers;
});

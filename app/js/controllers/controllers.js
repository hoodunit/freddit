/**
 * Base controller. New controllers need to be registered here.
 **/ 

define(['angular','js/controllers/overview', 'js/controllers/subreddits', 'js/controllers/post', 'js/controllers/settings'], 
       function (angular,OverviewCtrl, SubredditsCtrl, PostCtrl, SettingsCtrl) {
 	 var controllers = angular.module('controllers', ['services']);

 	 controllers.controller('SubredditsCtrl', SubredditsCtrl);
 	 controllers.controller('PostCtrl', PostCtrl);
 	 controllers.controller('OverviewCtrl', OverviewCtrl);
 	 controllers.controller('SettingsCtrl', SettingsCtrl);

 	 return controllers;
});

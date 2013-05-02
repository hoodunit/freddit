/**
 * Base service. New services need to be registered here.
 **/
define(['angular', 'js/services/reddit_api', 'js/services/settings'], 
       function (angular, RedditAPIService, SettingsService) {
	 var services = angular.module('services', []);
         services.service('RedditAPI', RedditAPIService);
         services.service('Settings', SettingsService);
 	 return services;
       });



       

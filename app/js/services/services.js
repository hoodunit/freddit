/**
 * Base service. New services need to be registered here.
 **/
define(['angular', 'js/services/reddit_api'], 
       function (angular, RedditAPIService) {
	 var services = angular.module('services', []);
         services.service('RedditAPI', RedditAPIService);
 	 return services;
       });



       

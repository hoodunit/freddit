/**
 * Base service. New services need to be registered here.
 **/
define(['angular', 'js/services/user'], 
       function (angular, UserService) {
	 var services = angular.module('services', []);
         services.service('User', UserService);
 	 return services;
       });



       

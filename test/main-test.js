(function (window, require) {
  'use strict';
  var file, requireModules;
  requireModules = [];

  // In newer versions, it has been renamed to __karma__
  if (window.__testacular__ == undefined && window.__karma__ != null) {
    window.__testacular__ = window.__karma__;
  }  

  for (file in window.__testacular__.files) {
    if (window.__testacular__.files.hasOwnProperty(file)) {
      if (file.substring(file.length - 7, file.length) === 'Test.js') {
        requireModules.push(file);
      }
    }
  }
  
  requireModules.push('js/app');
  requireModules.push('mocks');
  
  require({
    baseUrl:'/base/app',
    paths:{
      'angular' : 'lib/angular/angular',
      'resource' : 'lib/angular/angular-resource',
      'mocks' : '../test/lib/angular/angular-mocks'
    },
    shim:{
      'angular' : { 'exports' : 'angular' },
      'resource' : { deps : ['angular'] },
      'mocks': { deps : ['angular'], 'exports' : 'mocks'}
    }
  }, requireModules, function () {
    window.__testacular__.start();
  }, function (err) {
    var failedModules = err.requireModules;
    if (failedModules && failedModules[0]) {
      throw new Error("Failed modules: " + failedModules);
    } else {
      throw new Error("Failure: " + err);
    }
  });
}(window, require));

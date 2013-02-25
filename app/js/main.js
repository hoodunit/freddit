require.config({
  baseUrl: '/',
  paths: {
    jquery: 'lib/jquery/jquery',
    angular: 'lib/angular/angular',
    app: 'js/app'
  },
  shim: {
    'angular': {
      deps: ['jquery'],
      exports: 'angular'
    }
  }
});

(function() {
  function tryHoldReady() {
    if (!tryHoldReady.executed && window.jQuery) {
      window.jQuery.holdReady(true);
      tryHoldReady.executed = true;
    }
  }
  tryHoldReady();
  require.onResourceLoad = tryHoldReady;
  require([
    // dependencies
    'jquery',
    'angular',

    // application
    'app',
    'js/mobile-nav.js',
    
    // services
    'js/services/services.js',
    
    // controllers
    'js/controllers/controllers.js'
  ], function() {
    // done loading
    jQuery.holdReady(false);
  });

})();

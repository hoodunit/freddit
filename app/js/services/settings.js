define(function () {
  'use strict';

  function Settings(){
    this.showNSFW = false;

    this.getNSFWFlag = function(){
      return this.showNSFW;
    };

    this.setNSFWFlag = function(nsfw){
      this.showNSFW = nsfw;
    };
  }

  return Settings;
});

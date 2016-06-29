(function() {
  'use strict';

  angular
    .module('app')
    .service('MxBasePickerService', MxBasePickerService);

  function MxBasePickerService() {
    console.log("mxBasePickerService initialized");
  }

})();

(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mxPickerNew', mxPickerNew);

    function mxPickerNew() {
        var directive = new mx.components.FormControlBase(mx.components.MxPickerCtrl, 'directives/mxPicker.directive.html');

        angular.extend(directive.bindToController, mx.components.BasePickerProperties);

        directive.bindToController.disabled     = '=ngDisabled';
        directive.bindToController.required     = '=';
        directive.bindToController.hint         = '@';
        directive.bindToController.loadOnTyping = '@';

        return directive;
    }

})(window);

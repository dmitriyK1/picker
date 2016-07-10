(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mxPickerNew', mxPickerNew);

    function mxPickerNew() {
        var directive = new mx.components.FormControlBase(mx.components.MxPickerCtrl, 'directives/mxPicker.directive.html');

        angular.extend(directive.bindToController, mx.components.BasePickerProperties);

        directive.bindToController.disabled = '=ngDisabled';
        directive.bindToController.required = '=';
        directive.bindToController.hint = '@';
        directive.bindToController.loadOnTyping = '@';

        var originalLink = directive.link;
        directive.link = link;

        return directive;

        function link(scope, element, attrs, ctrl) {
            originalLink.apply(this, arguments);

            element.on('keydown', onKeyDown);
            element.on('focusin', onFocusOut);

            element.on('$destroy', cleanUp);
            scope.$on('$destroy', cleanUp);

            function onKeyDown() {
                element
                    .addClass('mx-picker-autocomplete--touched')
                    .off('keydown', onKeyDown);
            }

            function onFocusOut() {
                var input = element.find('input');

                if (!input.val().trim()) {
                    input.val('');
                }
            }

            function cleanUp() {
                element.off();
            }

        }

    }

})(window);

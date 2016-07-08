(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mxPickerNew', mxPickerNew);

    function mxPickerNew($timeout) {
        var directive = new mx.components.FormControlBase(mx.components.MxPickerCtrl, 'directives/mxPicker.directive.html');

        angular.extend(directive.bindToController, mx.components.BasePickerProperties);

        directive.bindToController.disabled = '=ngDisabled';
        directive.bindToController.required = '=';
        directive.bindToController.hint = '@';
        directive.bindToController.loadOnTyping = '@';

        var initialLink = directive.link;

        directive.link = function link(scope, element, attrs, ctrls) {
            initialLink.apply(directive, arguments);




            $timeout(function() {

                var input = element.find('input');

                input.on('select', function() {
                    scope.selecting = true;
                    scope.$digest();
                }).on('focusin', function() {
                    scope.selecting = true;
                    scope.$digest();
                }).on('mousedown keydown', function(e) {
                    if (e.keyCode === 65 && e.ctrlKey) return;

                    $timeout(function() {
                        scope.selecting = false;
                        scope.$digest();
                    });
                }).on('focusout', function() {
                    scope.selecting = false;
                    scope.$digest();
                });

            }, 10);

            scope.$on('$destroy', function cleanUp() {
                input.off();
            });

        };

        return directive;
    }

})(window);

(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mxPickerNew', mxPickerNew);

    function mxPickerNew($timeout) {
        var directive = new mx.components.FormControlBase(mx.components.MxPickerCtrl, 'directives/mxPicker.directive.html');

        angular.extend(directive.bindToController, mx.components.BasePickerProperties);

        directive.bindToController.disabled     = '=ngDisabled';
        directive.bindToController.required     = '=';
        directive.bindToController.hint         = '@';
        directive.bindToController.loadOnTyping = '@';

        var initialLink = directive.link;

        directive.link = function link(scope, element, attrs, ctrls) {
            initialLink.apply(directive, arguments);


            $timeout(function() {

                element.find('input').on('select', function() {
                    scope.selecting = true;
                    scope.$digest();
                    console.log('select: ', scope.selecting);
                });

                element.find('input').on('focusin', function() {
                    scope.selecting = true;
                    scope.$digest();
                    console.log('focusin: ', scope.selecting);
                });

                element.find('input').on('mousedown keydown', function() {
                    $timeout(function() {
                        scope.selecting = false;
                        scope.$digest();
                        console.log('mousedown: ', scope.selecting);
                    });
                });

                element.find('input').on('focusout', function() {
                    scope.selecting = false;
                    scope.$digest();
                    console.log('focusout: ', scope.selecting);
                });

            }, 10);


        };

        return directive;
    }

})(window);

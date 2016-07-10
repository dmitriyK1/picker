(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mxPickerNew', mxPickerNew);

    function mxPickerNew($mdConstant) {
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

            function onKeyDown(e) {
                var isCtrlPressed = e.ctrlKey;
                var isShiftPressed = e.shiftKey;
                var isXPressed = e.keyCode === 88;
                var isVPressed = e.keyCode === 86;
                var isTabPressed = e.keyCode === $mdConstant.KEY_CODE.TAB;
                var isDeletePressed = e.keyCode === $mdConstant.KEY_CODE.DELETE;
                var isBackspacePressed = e.keyCode === $mdConstant.KEY_CODE.BACKSPACE;
                var isArrowKeyPressed = (e.keyCode !== $mdConstant.KEY_CODE.UP_ARROW)
                    || (e.keyCode !== $mdConstant.KEY_CODE.DOWN_ARROW)
                    || (e.keyCode !== $mdConstant.KEY_CODE.LEFT_ARROW)
                    || (e.keyCode !== $mdConstant.KEY_CODE.RIGHT_ARROW);

                if (scope.vm.readOnly) {
                    if (isDeletePressed || isBackspacePressed || isXPressed || isVPressed) {
                        e.preventDefault();
                    }

                    if (!isCtrlPressed && !isTabPressed && !isArrowKeyPressed) {
                        e.preventDefault();
                    }

                }

                element
                    .addClass('mx-picker-autocomplete--touched');
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

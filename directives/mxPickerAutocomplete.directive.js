(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mxPickerAutocomplete', mxPickerAutocomplete);

    function mxPickerAutocomplete($mdConstant, $compile) {
        var ddo = {
            link    : link,
            require : 'mdAutocomplete'
        };

        return ddo;

        function link(scope, element, attrs, ctrl) {
            // element.on('focusin', onFocusIn);
            // element.on('focusout', onFocusOut);

            scope.$on('$destroy', function() {
                element.off('focusin');
                element.off('focusout');
            });

            function onFocusIn(e) {
                if (e.target.tagName !== 'INPUT') return;

                var inputValue = e.target.value;

                if (inputValue.trim().length === 0) {
                    e.target.value = e.target.value.trim();
                }

                setTimeout(function() {
                    angular
                        .element(document.querySelectorAll('.autocomplete-popover'))
                        .remove();

                    element.removeClass('valid-value');
                }, 100);
            }

            function onFocusOut(e) {
                if (e.target.tagName !== 'INPUT') return;

                setTimeout(function() {
                    if (!scope.searchText)    return;
                    if (!scope.filteredItems) return;

                    var isFound = scope.vm.items.some(function(value) {
                        return value.toLowerCase() === scope.searchText.toLowerCase();
                    });

                    if (scope.searchText !== scope.filteredItems[0]) {
                        ctrl.scope.isValidSearch = false;
                        return;
                    }

                    ctrl.scope.isValidSearch = true;

                    scope.doubleClick = function() {
                        angular
                            .element(document.querySelectorAll('.autocomplete-popover'))
                            .remove();

                        var input = element.find('input')[0];

                        input.focus();
                        input.setSelectionRange(0, input.value.length);
                    };

                    var template = '<div tabindex="-1" mxSglclick="vm.navigateItem(searchText)" ng-dblclick="doubleClick()">';
                    var linkFn   = $compile(template);
                    var popover  = linkFn(scope);

                    popover
                        .addClass('autocomplete-popover')
                        .html(scope.searchText);

                    element.append(popover);
                    element.addClass('valid-value');
                }, 10);

            }

        }
    }

})(window);

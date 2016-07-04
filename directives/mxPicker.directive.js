(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mxPickerNew', mxPickerNew)
        // .directive('mxPickerAutocomplete', mxPickerAutocomplete)

    function mxPickerNew() {
        var directive = new mx.components.FormControlBase(mx.components.MxPickerCtrl, 'directives/mxPicker.directive.html');

        angular.extend(directive.bindToController, mx.components.BasePickerProperties);

        directive.bindToController.disabled     = '=ngDisabled';
        directive.bindToController.required     = '=';
        directive.bindToController.hint         = '@';
        directive.bindToController.loadOnTyping = '@';

        return directive;
    }


    // function mxPickerNew() {
    //     var bindToController = {
    //         disabled     : '=ngDisabled',
    //         readOnly     : '=',
    //         required     : '=',
    //         label        : '@',
    //         hint         : '@',
    //         model        : "=ngModel",
    //         name         : "@",
    //         onChange     : "&"
    //     };
    //
    //     angular.extend(bindToController, w.mx.components.CommonPickerProperties);
    //
    //     var ddo = {
    //         templateUrl      : 'directives/mxPicker.directive.html',
    //         controller       : 'MxPickerCtrl as vm',
    //         scope            : {},
    //         bindToController : bindToController
    //     };
    //
    //     return ddo;
    // }

    function mxPickerAutocomplete($mdConstant, $compile) {
        var ddo = {
            link    : link,
            require : 'mdAutocomplete'
        };

        return ddo;

        function link(scope, element, attrs, ctrl) {
            scope.searchText  = '';
            scope.querySearch = querySearch;

            element.on('focusin', onFocusIn);
            element.on('focusout', onFocusOut);
            element.on('keydown', onKeyDown);

            scope.$on('$destroy', function() {
                element.off('keydown');
                element.off('focusin');
                element.off('focusout');
            });

            function querySearch(query, items) {
                return query ? scope.filteredItems = items.filter(createFilterFor(query)) : items;
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(state) {
                    return (state.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
            }

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

            function onKeyDown(event) {
                if (!scope.filteredItems) return;
                if (!scope.searchText) return;

                if (scope.filteredItems.length && ~scope.filteredItems[0].indexOf(scope.searchText)) {
                    scope.selectedItem = null;
                    return;
                }

                if (event.keyCode !== $mdConstant.KEY_CODE.TAB)  return;
                if (scope.filteredItems.length !== 1)            return;
                if (scope.searchText === scope.filteredItems[0]) return;

                ctrl.select(0);
            }

        }
    }


})(window);

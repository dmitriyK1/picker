(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mdAutocomplete', mdAutocomplete)
        .directive('clearAutocomplete', clearAutocomplete)
        .directive('mxPicker', mxPicker)

    function mxPicker(commonPickerProperties) {

        var bindToController = {
            disabled      : '=ngDisabled',
            readOnly      : '=',
            required      : '=',
            label         : '@',
            items         : '=',
            showHints     : '=hints',
            onSearchClick : '&',
            onCreateClick : '&'
        };

        angular.extend(bindToController, commonPickerProperties);

        var ddo = {
            templateUrl      : 'directives/mxPicker.directive.html',
            controller       : 'MxPickerCtrl as vm',
            scope            : {},
            bindToController : bindToController,
            link             : link
        };

        return ddo;

        function link(scope, element, attrs, ctrl) {
            // for debugging, delete later
            console.count('Directives count');
            console.dir(ctrl);
        }
    }

    function mdAutocomplete($mdConstant) {
        var ddo = {
            link    : link,
            require : 'mdAutocomplete'
        };

        return ddo;

        function link(scope, element, attrs, ctrl) {
            scope.searchText         = '';
            scope.querySearch        = querySearch;
            scope.onSearchTextChange = onSearchTextChange;
            scope.onValueClick       = onValueClick;

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

                e.target.value = e.target.value.trim();

                setTimeout(function() {
                    angular
                        .element(document.querySelectorAll('.autocomplete-popover'))
                        .remove();
                }, 100);
            }

            function onFocusOut(e) {
                if (e.target.tagName !== 'INPUT') return;

                setTimeout(function() {
                    if (!scope.searchText) return;
                    if (!scope.filteredItems) return;

                    var isFound = scope.items.some(function(value) {
                        return value.toLowerCase() === scope.searchText.toLowerCase();
                    });

                    if (scope.searchText !== scope.filteredItems[0]) {
                        ctrl.scope.isValidSearch = false;
                        return;
                    }

                    ctrl.scope.isValidSearch = true;

                    var popover = angular
                        .element('<div>')
                        .addClass('autocomplete-popover')
                        .html(scope.searchText);

                    element.append(popover);
                }, 10);
            }

            function onSearchTextChange() {
                if (!scope.searchText) {
                    scope.symbolsCount = 0;
                    return;
                }

                scope.symbolsCount = scope.searchText.length;
            }

            function onValueClick(e) {
                if (e.target.className !== 'autocomplete-popover') return;

                alert('Redirecting...');
            }

            function onKeyDown(event) {
                if (!scope.filteredItems) return;
                if (!scope.searchText) return;

                if (scope.filteredItems.length && ~scope.filteredItems[0].indexOf(scope.searchText)) {
                    scope.selectedItem = null;
                    return;
                }

                if (event.keyCode !== $mdConstant.KEY_CODE.TAB) return;
                if (scope.filteredItems.length !== 1) return;
                if (scope.searchText === scope.filteredItems[0]) return;

                ctrl.select(0);
            }

        }
    }

    function clearAutocomplete($parse, $compile) {
        var ddo = {
            restrict: 'A',
            link: link
        };

        return ddo;

        function link(scope, element, attrs) {
            var template = [
                '<md-button ng-hide="vm.disabled || vm.readOnly" tabindex="-1" class="md-icon-button clear-autocomplete">',
                '<md-icon md-svg-icon="md-close">',
                '</md-icon>',
                '</md-button>'
            ].join('');

            var linkFn = $compile(template);
            var button = linkFn(scope);
            element.append(button);

            var searchTextModel = $parse(attrs.mdSearchText);

            scope.$watch(searchTextModel, function(searchText) {
                if (searchText && searchText !== '' && searchText !== null) {
                    button.addClass('visible');
                } else {
                    button.removeClass('visible');
                }
            });

            button.on('click', onClick);

            scope.$on('$destroy', function() {
                button.off('click');
            });

            function onClick() {
                searchTextModel.assign(scope, undefined);
                scope.$digest();
                angular.element(document.querySelectorAll('.autocomplete-popover')).remove();
            }
        }

    }

})(window);

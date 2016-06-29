
angular
    .module('app', ['ngMaterial', 'ngMessages'])
    .directive('mdAutocomplete', mdAutocomplete)
    .directive('clearAutocomplete', clearAutocomplete)
    .run(runBlock)

function runBlock($rootScope) {
    $rootScope.autocompleteItems = ['Broccoli', 'Cabbage', 'Carrot', 'Lettuce', 'Spinach'];
    $rootScope.searchText        = '';
    $rootScope.querySearch       = querySearch;

    function querySearch(query) {
        return query ?
                        $rootScope.filteredItems = $rootScope.autocompleteItems.filter(createFilterFor(query))
                        : $rootScope.autocompleteItems;
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(state) {
            return (state.toLowerCase().indexOf(lowercaseQuery) === 0);
        };
    }
}

function mdAutocomplete($mdConstant) {
    return {
        link: link,
        require: 'mdAutocomplete'
    };

    function link(scope, element, attrs, ctrl) {
        element.on('focusin', onFocusIn);
        element.on('focusout', onFocusOut);

        scope.$on('$destroy', function() {
            element.off('focusin');
            element.off('focusout');
        });

        function onFocusIn(e) {
            if (e.target.tagName !== 'INPUT') return;

            setTimeout(function() {
                angular
                    .element(document.querySelectorAll('.autocomplete-popover'))
                    .remove();
            }, 100);
        }

        function onFocusOut(e) {
            if (e.target.tagName !== 'INPUT') return;

            setTimeout(function() {
                // if (scope.filteredItems && !scope.filteredItems.length) return;
                if (!scope.searchText)           return;
                if (!scope.filteredItems) return;

                var isFound = scope.autocompleteItems.some(function(value) {
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

        scope.onSearchClick = function() {
            alert('search...');
        };

        scope.onSearchTextChange = function() {
            if (!scope.searchText) {
                scope.symbolsCount = 0;
                return;
            }

            scope.symbolsCount = scope.searchText.length;
        };

        scope.onValueClick = function(e) {
            if (e.target.className !== 'autocomplete-popover') return;

            alert('Redirecting...');
        };

        element.bind('keydown', function(event) {
            if (!scope.filteredItems) return;
            if (!scope.searchText)    return;

            if (scope.filteredItems.length && ~scope.filteredItems[0].indexOf(scope.searchText)) {
                scope.selectedItem = null;
                return;
            }

            if (event.keyCode !== $mdConstant.KEY_CODE.TAB)   return;
            if (scope.filteredItems.length !== 1)             return;
            if (scope.searchText === scope.filteredItems[0])  return;

            ctrl.select(0);
        });

    }
}

function clearAutocomplete($parse, $compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var template = '<md-button ng-hide="isDisabled" tabindex="-1" class="md-icon-button clear-autocomplete"><md-icon md-svg-icon="md-close"></md-icon></md-button>';

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

            button.on('click', function() {
                searchTextModel.assign(scope, undefined);
                scope.$digest();
                angular.element(document.querySelectorAll('.autocomplete-popover')).remove();
            });
        }
    }
}

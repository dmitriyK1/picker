angular
    .module('app', ['ngMaterial', 'ngMessages'])
    .run(runBlock)
    .directive('mdBlur', mdBlur)
    .directive('mdFocus', mdFocus)
    .directive('mdAutocomplete', mdAutocomplete)
    .directive('mdHideAutocompleteOnEnter', mdHideAutocompleteOnEnter)
    .directive('clearAutocomplete', clearAutocomplete);

// ================================================================================

function runBlock($rootScope) {
    $rootScope.autocompleteItems = ['Broccoli', 'Cabbage', 'Carrot', 'Lettuce', 'Spinach'];
    $rootScope.items             = [];
    $rootScope.searchText        = '';
    $rootScope.searchText2       = 'Some value';
    $rootScope.isDisabled        = false;
    $rootScope.noCache           = true;
    $rootScope.querySearch       = querySearch;

    function querySearch(query) {
        return query ? $rootScope.autocompleteItems.filter(createFilterFor(query)) : $rootScope.autocompleteItems;
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(state) {
            return (state.toLowerCase().indexOf(lowercaseQuery) === 0);
        };
    }
}

function mdBlur($mdUtil, $timeout, $rootScope) {
    return {
        require: "^mdAutocomplete",
        link: function($scope, $element, $attributes, $mdAutocompleteCtrl) {
            $timeout(function() {
                var input      = $element.find("input");
                var nativeBlur = $mdAutocompleteCtrl.blur;

                $mdAutocompleteCtrl.blur = function() {
                    var searchText  = $mdAutocompleteCtrl.scope.searchText;
                    var isItemFound = ~$rootScope.autocompleteItems.indexOf(searchText);

                    nativeBlur.call($mdAutocompleteCtrl);
                    $mdUtil.nextTick(function() {
                        $scope.$eval($attributes.mdBlur, {
                            "$mdAutocomplete": $mdAutocompleteCtrl
                        });

                        if (!isItemFound) {
                            $scope.searchTextValid = false;
                            $element.addClass('error');
                        } else {
                            $scope.searchTextValid = true;
                        }

                    });
                };
            });
        }
    };
}

function mdFocus($mdUtil, $timeout) {
    return {
        require: "^mdAutocomplete",
        link: function($scope, $element, $attributes, $mdAutocompleteCtrl) {
            $timeout(function() {
                var input       = $element.find("input");
                var nativeFocus = $mdAutocompleteCtrl.focus;

                $mdAutocompleteCtrl.focus = function () {

                    // prevent selection
                    // var value = $element.find('input').val();
                    // $element.find('input').val(value);

                    nativeFocus.call($mdAutocompleteCtrl);

                    $mdUtil.nextTick(function() {
                        $scope.$eval($attributes.mdBlur, {
                            "$mdAutocomplete": $mdAutocompleteCtrl
                        });

                        $element.removeClass('error');

                        $timeout(function() {
                            $scope.searchTextValid = false;
                        }, 300);

                    });
                };
            });
        }
    };
}

function mdAutocomplete() {
    return {
        link: link,
        require: 'mdAutocomplete'
    };

    function link(scope, element) {
        scope.onValueClick = function(e, isValid) {
            if (!isValid) return;
            if (e.target.tagName !== 'INPUT' || !scope.searchText) return;

            element.find('input').blur();

            alert('Redirecting...');
        };

    }
}

function mdHideAutocompleteOnEnter($mdConstant) {
    return {
        link: link,
        require: 'mdAutocomplete'
    };

    function link(scope, element, attrs, ctrl) {
        element.bind("keydown keypress keyup", function(event) {
            // var isDropdownHidden = scope.$$childHead.$mdAutocompleteCtrl.hidden;

            // if (isDropdownHidden && (event.keyCode === $mdConstant.KEY_CODE.UP_ARROW || event.keyCode === $mdConstant.KEY_CODE.DOWN_ARROW)) {
            //     scope.$applyAsync(function() {
            //         ctrl.scope.selectedItem = '';
            //         ctrl.index = 0;
            //         scope.$$childHead.$mdAutocompleteCtrl.hidden = false;
            //     });
            // }

        });
    }
}

function clearAutocomplete($parse, $compile) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var template = '<md-button tabindex="-1" class="md-icon-button clear-autocomplete"><md-icon md-svg-icon="md-close"></md-icon></md-button>';

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
            });
        }
    }
}

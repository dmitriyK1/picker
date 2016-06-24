angular
        .module('app', ['ngMaterial', 'ngMessages'])
        .run(function ($rootScope) {
            $rootScope.autocompleteItems = ['Broccoli', 'Cabbage', 'Carrot', 'Lettuce', 'Spinach'];
            $rootScope.items             = [];
            $rootScope.searchText        = '';
            $rootScope.searchText2       = 'Some value';
            $rootScope.isDisabled        = false;
            $rootScope.noCache           = true;
            $rootScope.querySearch       = querySearch;

            function querySearch(query) {
                var results = query
                        ? $rootScope.autocompleteItems.filter(createFilterFor(query))
                        : $rootScope.autocompleteItems;

                return results;
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(state) {
                    var searchResult = (state.toLowerCase().indexOf(lowercaseQuery) === 0);
                    return searchResult;
                };
            }

        })
        .directive('mdBlur', function ($mdUtil, $timeout, $rootScope) {
            return {
                require: "^mdAutocomplete",
                link: function ($scope, $element, $attributes, $mdAutocompleteCtrl) {
                    $timeout(function () {
                        var input      = $element.find("input");
                        var element    = $element[0];
                        var nativeBlur = $mdAutocompleteCtrl.blur;

                        $mdAutocompleteCtrl.blur = function () {

                            var searchText  = $mdAutocompleteCtrl.scope.searchText;
                            var isItemFound = ~$rootScope.autocompleteItems.indexOf(searchText);

                            nativeBlur.call($mdAutocompleteCtrl);
                            $mdUtil.nextTick(function () {
                                $scope.$eval($attributes.mdBlur, {"$mdAutocomplete": $mdAutocompleteCtrl});

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
        })
        .directive('mdFocus', function ($mdUtil, $timeout) {
            return {
                require: "^mdAutocomplete",
                link: function ($scope, $element, $attributes, $mdAutocompleteCtrl) {
                    $timeout(function () {
                        var input = $element.find("input");
                        var element = $element[0];
                        var nativeFocus = $mdAutocompleteCtrl.focus;

                        $mdAutocompleteCtrl.focus = function (e) {

                            // prevent selection
                            var value = $element.find('input').val();
                            $element.find('input').val(value);

                            nativeFocus.call($mdAutocompleteCtrl);

                            $mdUtil.nextTick(function () {
                                $scope.$eval($attributes.mdBlur, {"$mdAutocomplete": $mdAutocompleteCtrl});
                                $element.removeClass('error');

                                $timeout(function () {
                                    $scope.searchTextValid = false;
                                }, 300);
                            });
                        };
                    });
                }
            };
        })
        .directive('mdAutocomplete', function ($mdConstant) {
            var ddo = {
                link: link,
                require: 'mdAutocomplete'
            };

            return ddo;

            function link(scope, element, attrs, ctrl) {

                scope.onValueClick = function (e, isValid) {
                    if (!isValid) return;
                    if (e.target.tagName !== 'INPUT' || !scope.searchText) return;

                    element.find('input').blur();

                    alert('Redirecting...');
                };

                element.on('keydown', function onKeyDown(e) {

                    var inputValue = scope.searchText;

                    if (inputValue) {
                        scope.$applyAsync(function () {
                            scope.$$childHead.$mdAutocompleteCtrl.hidden = true;
                        });

                        return;
                    }

                    // var isTabPressed     = e.keyCode === $mdConstant.KEY_CODE.TAB;
                    // var isDropdownHidden = scope.$$childHead.$mdAutocompleteCtrl.hidden;
                    //
                    // if (!isDropdownHidden && isTabPressed) {
                    // e.preventDefault();
                    // }

                });

            }
        })
        .directive('mdHideAutocompleteOnEnter', function ($timeout, $mdConstant) {
            var ddo = {
                link: link,
                require: 'mdAutocomplete'
            };

            return ddo;

            function link(scope, element, attrs, ctrl) {
                element.bind("keydown keypress keyup", function (event) {
                    var isDropdownHidden = scope.$$childHead.$mdAutocompleteCtrl.hidden;

                    // enter
                    // if (!isDropdownHidden && event.which === $mdConstant.KEY_CODE.ENTER) {
                            // scope.$$childHead.$mdAutocompleteCtrl.hidden = true;
                            // element.find('input').blur();

                        // return;
                    // }


                    // up & down
                    if (isDropdownHidden && (event.keyCode === $mdConstant.KEY_CODE.UP_ARROW || event.keyCode === $mdConstant.KEY_CODE.DOWN_ARROW)) {
                        ctrl.scope.selectedItem                      = '';
                        ctrl.index                                   = 0;
                        scope.$$childHead.$mdAutocompleteCtrl.hidden = false;
                    }

                });
            };
        })

        .directive('clearAutocomplete', function ($parse, $compile) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var template = '<md-button class="md-icon-button clear-autocomplete"><md-icon md-svg-icon="md-close"></md-icon></md-button>';

                    var linkFn = $compile(template);
                    var button = linkFn(scope);
                    element.append(button);

                    var searchTextModel = $parse(attrs.mdSearchText);

                    scope.$watch(searchTextModel, function (searchText) {
                        if (searchText && searchText !== '' && searchText !== null) {
                            button.addClass('visible');
                        } else {
                            button.removeClass('visible');
                        }
                    });

                    button.on('click', function () {
                        searchTextModel.assign(scope, undefined);
                        scope.$digest();
                    });
                }
            }
        })



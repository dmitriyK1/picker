(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mdFocus', [ "$mdUtil", "$timeout", function($mdUtil, $timeout) {
            return {
                require: "^mdAutocomplete",
                link: function($scope, $element, $attributes, $mdAutocompleteCtrl) {
                    $timeout(function() {
                        var input       = $element.find("input");
                        var element     = $element[0];
                        var nativeFocus = $mdAutocompleteCtrl.focus;

                        $mdAutocompleteCtrl.focus = function() {
                            nativeFocus.call($mdAutocompleteCtrl);

                            $mdUtil.nextTick(function () {
                                $scope.$eval($attributes.mdFocus, {"$mdAutocomplete": $mdAutocompleteCtrl });

                                var inputValue = input.value;

                                if (inputValue && !inputValue.trim()) {
                                    input.value = '';
                                }

                            });
                        };
                    });
                }
            };
        } ]);

})(window);



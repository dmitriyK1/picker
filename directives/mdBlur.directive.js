(function(w) {
    'use strict';

    angular
        .module('app')
        .directive('mdBlur', [ "$mdUtil", "$timeout", "$parse", function($mdUtil, $timeout, $parse) {
            return {
                require: "^mdAutocomplete",
                link: function($scope, $element, $attributes, $mdAutocompleteCtrl) {
                    $timeout(function() {
                        var input       = $element.find("input");
                        var element     = $element[0];
                        var nativeBlur = $mdAutocompleteCtrl.blur;

                        $mdAutocompleteCtrl.blur = function() {
                            var fn = $parse($attributes['mdBlur']);
                            fn();

                            $element.addClass('mx-picker-autocomplete--touched');

                            nativeBlur.call($mdAutocompleteCtrl);

                            $mdUtil.nextTick(function () {
                                $scope.$eval($attributes.mdBlur, {"$mdAutocomplete": $mdAutocompleteCtrl });
                            });
                        };
                    });
                }
            };
        } ]);

})(window);



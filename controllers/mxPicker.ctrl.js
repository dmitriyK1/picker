(function(w) {
    'use strict';

    angular
        .module('app')
        .controller('MxPickerCtrl', MxPickerCtrl)

    function MxPickerCtrl() {
        var vm = this;

        vm.onItemChange = onItemChange;
        vm.autoCompleteSelectedItemChange = autoCompleteSelectedItemChange;

        function onItemChange(item) {
            if (vm.onChange) {
                vm.onChange();
            }


            vm.autoCompleteSelectedItemChange(item);
        }

        function autoCompleteSelectedItemChange(item) {
            console.log('temporary stub function fired, item: ', item);
        }

    }

})(window);

(function(w) {
    'use strict';

    angular
        .module('app')
        .controller('MxPickerCtrl', MxPickerCtrl)

    function MxPickerCtrl() {
        var vm = this;

        vm.onItemChange                   = onItemChange;
        vm.autoCompleteSelectedItemChange = autoCompleteSelectedItemChange;

        // delete
        vm.notFoundMessage = 'No matching states were found.';

        function onItemChange(item) {
            if (vm.onChange) {
                vm.onChange();
            }


            vm.autoCompleteSelectedItemChange(item);
        }

        // delete
        function autoCompleteSelectedItemChange(item) {
            console.log('temporary stub function fired, item: ', item);
        }

    }

})(window);

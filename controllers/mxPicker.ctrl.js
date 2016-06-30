(function(w) {
    'use strict';

    angular
        .module('app')
        .controller('MxPickerCtrl', MxPickerCtrl)

    function MxPickerCtrl(mxBasePickerService) {
        var vm                  = this;
        vm.selectedItem         = vm.model;
        vm.setSelectedItems     = setSelectedItems;
        vm.selectedItemsToValue = selectedItemsToValue;
        vm.setAutoCompleteValue = setAutoCompleteValue;

        function setAutoCompleteValue(value) {
            vm.model = value;
        }

        function setSelectedItems(items) {
            vm.selectedItem = items.length
                                            ? items[0]
                                            : null;
        }

        function selectedItemsToValue() {
            return vm.selectedItem
                                    ? mxBasePickerService.getId(vm.selectedItem)
                                    : null;
        }

        console.dir( mxBasePickerService );
    }

})(window);

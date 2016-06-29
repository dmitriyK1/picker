function MxAutocompleteCtrl($timeout, $q, $element, $scope, internationalization) {

	var vm                  = this;
	vm.selectedItem         = vm.model;
	vm.setSelectedItems     = setSelectedItems;
	vm.selectedItemsToValue = selectedItemsToValue;
	vm.setAutoCompleteValue = setAutoCompleteValue;

	mx
	    .components
	    .SinglePickerCtrl
	    .call(this, $timeout, $q, $element, $scope, internationalization);


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
								? vm.getId(vm.selectedItem)
								: null;
	}

}


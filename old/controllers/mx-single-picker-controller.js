function MxSinglePickerCtrl($timeout, $q, $element, $scope, internationalization) {

	var vm    = this;

	vm.single = true;

	mx
		.components
		.MultiPickerControllerBase
		.call(this, $timeout, $q, $element, $scope, internationalization);
}


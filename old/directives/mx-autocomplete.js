angular
	.module('mx.components')
	.directive('mxAutocomplete', mxAutocomplete);

function mxAutocomplete() {
	var directive = new mx
							.components
							.FormControlBase(MxAutocompleteCtrl, 'mx-picker/mx-autocomplete.html');
							 // положил в файл контроллер

	angular
		.extend(
			directive.bindToController,
			mx.components.BasePickerProperties
		);

	directive
		.bindToController
		.loadOnTyping = '@';

	return directive;
}


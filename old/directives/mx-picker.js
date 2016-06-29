angular
	.module('mx.components')
	.directive('mxPicker', mxPicker);


function mxPicker() {
	var directive = new mx
						.components
						.FormControlBase(MxSinglePickerCtrl, 'mx-picker/mx-multi-picker.html');
					    // положил контроллер в отдельный файл

	angular.extend(
	    directive.bindToController,
	    mx.components.CommonPickerProperties
	);

	return directive;
}

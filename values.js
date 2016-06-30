(function() {
	'use strict';

    var basePickerProperties = {
        items             : '=',
        itemIdField       : '@',
        itemsIsPlainArray : '@',
        itemTitleField    : '@',
        loadItems         : '=',
        dropdownHtmlClass : '@',
        selectedItems     : '='
    };

    var commonPickerProperties = angular.extend(
        basePickerProperties, {
            loadOnTyping     : '@',
            loadDelay        : '@',
            navigateItem     : '=',
            browseLookup     : '=',
            notFound         : '=',
            itemDetailsField : '@'
        });


	angular
		.module('app')
		.value('basePickerProperties', basePickerProperties)
		.value('commonPickerProperties', commonPickerProperties)
})();

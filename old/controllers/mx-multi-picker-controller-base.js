function MxMultiPickerControllerBase($timeout, $q, $element, $scope, internationalization) {

	var vm                      = this;

	vm.onNavigateItem           = onNavigateItem;
	vm.onBrowseLookup           = onBrowseLookup;
	vm.selectedItems            = [];
	vm.extraFilterSelectedItems = extraFilterSelectedItems;
	vm.onSelectionChange        = onSelectionChange;
	vm.selectedItemsToValue     = selectedItemsToValue;
	vm.setSelectedItems         = setSelectedItems;
	vm.getSelectedItemTitle     = getSelectedItemTitle;
	vm.getItemDetails           = getItemDetails;
	vm.itemsIsPlainArray        = typeof (vm.itemsIsPlainArray === 'string')
																			? vm.itemsIsPlainArray || ''.toLowerCase() === 'true'
																			: vm.itemsIsPlainArray || false;


	vm.TypingChanged = function() {
		_setLabels();
	};

	_setLabels();

	mx
		.components
		.PickerControlControllerBase
		.call(this, $timeout, $q, $element, $scope, internationalization);


	function getItemDetails(item) {
		if (vm.itemDetailsField) {
			return item[vm.itemDetailsField];
		}

		return null;
	}

	function getSelectedItemTitle(item) {
		var name = vm.getTitle(item);

		if (vm.itemDetailsField) {
			var details = item[vm.itemDetailsField];
			if (details) {
				name += details;
			}
		}

		return name;
	}


	function extraFilterSelectedItems(items) {
		if (items.length > 0 && vm.selectedItems.length > 0) {

			var selectedIds = vm.selectedItems.map(function(item) {
				return vm.getId(item);
			});

			items = items.filter(function (item) {
				return selectedIds.indexOf(vm.getId(item)) < 0;
			});
		}
		return items;
	}

	function onBrowseLookup() {
		if (vm.browseLookup) {
			vm.browseLookup(vm.model).then(function(data) {
				if (data === null) {
					//clear selection
					vm.model = null;
				} else if(Array.isArray(data)) {
					var newItems = extraFilterSelectedItems(data);
					vm.model = vm.model
										? vm.model.concat(newItems)
										: newItems;
				} else {
					vm.model = data;
				}
			});
		}
	}

	function onNavigateItem(item) {
		if (vm.navigateItem) {
			vm.navigateItem(item);
		}
	}

	function onSelectionChange() {
		vm.internalSet = true;
		vm.model       = vm.selectedItemsToValue();

		_setLabels();

		vm.setNotFoundButtonAvailability(true);

		vm.internalSet = false;

		if(vm.model === null){
			if(vm.searchInput !== null){
				vm.searchInput.focus();
			}
		}
	}

	function _setLabels() {
		if (vm.selectedItems.length > 0 || vm._isTyping) {
			vm.controlLabel    = vm.label;
			vm.autoPlaceholder = vm.defaultPickerLabel;
		} else {
			vm.controlLabel    = null;
			vm.autoPlaceholder = vm.label;
		}
	}

	function selectedItemsToValue() {
		var len = vm.selectedItems.length;

		if (len === 0) {
			return null;
		}

		var res = null;

		if (vm.single) {
			if (len > 1) {
				vm.selectedItems = [vm.selectedItems[len - 1]];
			}
			res = vm.getId(vm.selectedItems[0]);

		} else {

			res = vm.selectedItems.map(function(item) {
				return vm.getId(item);
			});
			if (vm.separatorChar) {
				res = res.join(vm.separatorChar);
			}
		}

		return res;
	}

	function setSelectedItems(items) {
		vm.selectedItems = items;
		_setLabels();
	}

}

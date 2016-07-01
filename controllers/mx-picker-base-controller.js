(function(w){
	'use strict';

	var MxPickerControlControllerBase = function ($timeout, $q, $element, $scope, internationalization) {
		var vm = this;
		vm.internalSet = false;
		var _items = null;
		var _tempValue = null;
		var valueReset = false;
		var _isAutoTyping;

		vm.notFoundMessage =  vm.notFound ? vm.notFound.message : internationalization.get('components.mx-picker.defaultNotFoundMessage');

		vm.defaultPickerLabel = internationalization.get('components.mx-picker.defaultLabel');
		vm.itemsIsPlainArray = typeof vm.itemsIsPlainArray === 'string' ? (vm.itemsIsPlainArray || '').toLowerCase() === 'true' : vm.itemsIsPlainArray || false;
		vm.isLoading = false;
		vm.setModelInternal = setModelInternal;
		_setItemsValue(vm.items);

		Object.defineProperty(vm, 'items', {
			get: function () {
				return _items;
			},
			set: _setItemsValue
		});

		function _setItemsValue(value) {
			_items = value || [];
			vm.itemsIsPlainArray = _items.length > 0 ? typeof _items[0] !== 'object' : vm.itemsIsPlainArray;

			if (_items.length > 0) {
				if (vm.isLoading) {
					if (_tempValue !== null) {
						vm.isLoading = false;
						vm.model = _tempValue;
						_tempValue = null;
					} else {
						var found = false;

						if (vm.model !== null && vm.model !== undefined) {
							var modelId = vm.model;

							for (var i = 0; i < _items.length; i++) {
								if (vm.getId(_items[i]) === modelId) {
									found = true;
									break;
								}
							}
						}

						if (!found) {
							vm.setModelInternal(vm.setFirstSelected ? vm.getId(_items[0]): null);
						}
					}
				}
			}
		}

		vm.loadOnTyping = typeof vm.loadOnTyping !== 'undefined' && vm.loadOnTyping !== false;
		if (vm.loadOnTyping && !vm.loadDelay) {
			vm.loadDelay = 1000;
		}

		vm.itemTitleField = vm.itemTitleField || 'name';
		vm.itemIdField = vm.itemIdField || 'id';

		var loadedItemsSearchText = null;
		var loadedItemsCompletely = false;

		vm.label = vm.label || vm.defaultPickerLabel;

		if (vm.loadItems && !vm.loadOnTyping) {
			reload();
		}

		vm.getTitle = getTitle;
		vm.getId = getId;
		vm.autoCompleteSearch = autoCompleteSearch;
		vm.autoCompleteSearchText = null;
		vm.autoCompleteSelectedItemChange = autoCompleteSelectedItemChange;
		vm.autoCompleteSearchTextChange = autoCompleteSearchTextChange;
		vm.setNotFoundButtonAvailability = setNotFoundButtonAvailability;
		vm.resetItemsCache = resetItemsCache;
		vm.availableNotFoundButton = false;


		this.onValueChanging = function(value) {
			if (vm.internalSet) {
				return value;
			}

			if (value !== null && value !== undefined) {
				var valueArray = null;
				var throwError = false;
				if (typeof value === 'string' && !isNaN(value)) {
					value = Number(value);
				} else if(Array.isArray(value)) {
					if (value.length > 0 && typeof value[0] === 'object') {
						throwError = true;
					}
					valueArray = value;
				} else if (typeof value === 'object') {
					throwError = true;

				}
				if (throwError) {
					throw new Error('Picker control does not recognize assigned data type');
				}
				if (!valueArray) {
					valueArray = [value];
				}

				if (valueArray.length !== 0) {
					if (vm.loadOnTyping) {
						//try get Display Strings

						vm.setSelectedItems(_valuesToItems(valueArray));
						return value;
					}
					var items = vm.items;

					if (items && items.length > 0) {

						var selectedItems = [];
						for(var i = 0; i < items.length; i++) {
							if (valueArray.indexOf(vm.getId(items[i])) >= 0) {
								selectedItems.push(items[i]);

								if (selectedItems.length === valueArray.length) {
									break;
								}
							}
						}

						vm.setSelectedItems(selectedItems);
						return vm.selectedItemsToValue();
					} else if(vm.isLoading) {
						_tempValue = value;
						vm.setSelectedItems(Array.isArray(value) ? value : [value]);
						return value;
					}
				}
			}

			vm.setSelectedItems([]);
			return null;
		};

		vm.setNotFoundButtonAvailability();

		vm.notFoundClick = function() {
			if(vm.notFound && vm.notFound.buttonClick) {
				vm.notFound.buttonClick();
				vm.availableNotFoundButton = false;
				loadedItemsCompletely = false;
				loadedItemsSearchText = '';
				//reload items list
				vm.searchInput.focus();
			}

			return true;
		};

		function setNotFoundButtonAvailability(makeCall) {
			if (vm.notFound) {
				var isConfigured = typeof vm.notFound.buttonClick === 'function';
				if (!vm.availableNotFoundButton && isConfigured && makeCall) {
					vm.notFound.buttonClick(true);
				}
				vm.availableNotFoundButton = isConfigured;
			}
		}

		Object.defineProperty(vm, '_isTyping', {
			get: function () {
				return _isAutoTyping;
			},
			set: function (value) {
				_isAutoTyping = value;
				if(vm.TypingChanged) {
					vm.TypingChanged();
				}
			}
		});

		vm.searchInput = null;

		$timeout(function() {
			vm.searchInput = $element.find('input');

			if (vm.searchInput) {
				vm.searchInput.on('blur', function() {
					vm.showingHints(false);
				});
				vm.searchInput.on('focus', function() {
					vm.showingHints(true);
				});
			}
		});

		mx.components.FormControlControllerBase.call(this, internationalization, $timeout);

		return vm;

		function _valuesToItems(values) {
			var items = values.map(function(val) {
				var item = {};
				item[vm.itemIdField] = val;
				return item;
			});

			vm.loadItems(null, vm, items);
			return items;
		}

		function getId(item) {
			if (vm.itemsIsPlainArray) {
				return item;
			}
			if (!item) {
				return null;
			}
			return item[vm.itemIdField];
		}

		function getTitle(item) {
			if (vm.itemsIsPlainArray) {
				return item;
			}
			if (!item) {
				return null;
			}
			return item[vm.itemTitleField];
		}

		function setModelInternal(value) {
			vm.internalSet = true;
			vm.model = value;
			//if(value === null){
			//	vm.autoCompleteSearchText = null;
			//}
			vm.internalSet = false;
		}

		function reload() {
			var searchText = vm.autoCompleteSearchText ? vm.autoCompleteSearchText.toLowerCase() : '';
			if (loadedItemsSearchText && searchText.startsWith(loadedItemsSearchText) && (loadedItemsCompletely || searchText.length === loadedItemsSearchText.length)) {
				if (loadedItemsSearchText !== searchText) {
					vm.items = filterItemsByTitle(searchText);
				}
				return vm.items;
			}

			return reloadAsync(searchText).then(function (data) {
				loadedItemsSearchText = null;
				var items = [];
				if (Array.isArray(data)) {
					items = data;
				}
				else if (data && data.items) {
					items = data.items;
					loadedItemsSearchText = data.searchText;
					loadedItemsCompletely = data.all;
				}

				vm.items = filterSelectedItems(items);

				return vm.items;
			});
		}

		function filterSelectedItems(items) {
			if (vm.extraFilterSelectedItems) {
				items = vm.extraFilterSelectedItems(items);
			}
			return items;
		}

		function resetItemsCache() {
			loadedItemsSearchText = null;
			loadedItemsCompletely = false;
		}

		function reloadAsync(searchText) {
			vm.isLoading = true;
			return vm.loadItems(searchText, vm);
		}

		function autoCompleteSearch() {
			if (vm.loadOnTyping && vm.loadItems) {
				if (!vm.autoCompleteSearchText) {
					return [];
				}
				return reload();
			} else {
				return filterItemsByTitle(vm.autoCompleteSearchText);
			}
		}

		function filterItemsByTitle(query) {
			query = (query || '').toLowerCase();
			var filteredItems = query ? vm.items.filter(function (item) {
				return getTitle(item).toLowerCase().indexOf(query) !== -1;
			}) : vm.items;

			return filterSelectedItems(filteredItems);
		}

		function autoCompleteSelectedItemChange(item) {
			var itemValue = item ? getId(item) : null;
			if (itemValue !== vm.model) {
				if (!itemValue) {
					if (vm._isTyping) {
						valueReset = true;
						return;
					}
				}

				_setAutoCompleteValue(itemValue);
			} else if(item === undefined) {
				vm.autoCompleteSearchText = null;
			}

			valueReset = false;
		}

		function _setAutoCompleteValue(value) {
			if (vm.setAutoCompleteValue) {
				vm.internalSet = true;
				vm.setAutoCompleteValue(value);
				if (!value) {
					vm.autoCompleteSearchText = null;
				}
				vm.internalSet = false;
			}

		}

		function autoCompleteSearchTextChange() {
			if (typeof vm._isTyping === 'undefined') {
				vm._isTyping = true;

				vm.searchInput.on('focus', function() {
					vm._isTyping = true;
				});

				vm.searchInput.on('blur', function() {
					vm._isTyping = false;
					if (valueReset) {
						$timeout(function() {
							if (valueReset) {
								valueReset = false;
								_setAutoCompleteValue(null);
							}
						}, 500);
					}
					else {
						if (vm.autoCompleteSearchText && !vm.model) {
							$timeout(function() {
								if (!vm.model) {
									vm.autoCompleteSearchText = null;
								}
							}, 300);
						}
					}
				});
			}
		}
	};

	w.mx = w.mx || {};
	w.mx.components = w.mx.components || {};
	w.mx.components.PickerControlControllerBase = MxPickerControlControllerBase;

})(window);

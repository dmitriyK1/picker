(function() {
  'use strict';

  angular
    .module('app')
    .service('mxBasePickerService', mxBasePickerService);

  function mxBasePickerService($timeout, $q) {
	var service = this;

	service.internalSet = false;

	var _items     = null;
	var _tempValue = null;
	var valueReset = false;
	var _isAutoTyping;

	// service.notFoundMessage =  service.notFound
	// 								? service.notFound.message
	// 								: internationalization.get('components.mx-picker.defaultNotFoundMessage');

	// service.defaultPickerLabel = internationalization.get('components.mx-picker.defaultLabel');
	service.itemsIsPlainArray  = typeof service.itemsIsPlainArray === 'string' ? (service.itemsIsPlainArray || '').toLowerCase() === 'true' : service.itemsIsPlainArray || false;
	service.isLoading          = false;
	service.setModelInternal   = setModelInternal;

	_setItemsValue(service.items);

	Object.defineProperty(service, 'items', {
		get: function () {
			return _items;
		},
		set: _setItemsValue
	});

	function _setItemsValue(value) {
		_items = value || [];
		service.itemsIsPlainArray = _items.length > 0 ? typeof _items[0] !== 'object' : service.itemsIsPlainArray;

		if (_items.length > 0) {
			if (service.isLoading) {
				if (_tempValue !== null) {
					service.isLoading = false;
					service.model     = _tempValue;
					_tempValue   = null;
				} else {
					var found = false;

					if (service.model !== null && service.model !== undefined) {
						var modelId = service.model;

						for (var i = 0; i < _items.length; i++) {
							if (service.getId(_items[i]) === modelId) {
								found = true;
								break;
							}
						}
					}

					if (!found) {
						service.setModelInternal(service.setFirstSelected ? service.getId(_items[0]): null);
					}
				}
			}
		}
	}

	service.loadOnTyping = typeof service.loadOnTyping !== 'undefined' && service.loadOnTyping !== false;

	if (service.loadOnTyping && !service.loadDelay) {
		service.loadDelay = 1000;
	}

	service.itemTitleField = service.itemTitleField || 'name';
	service.itemIdField    = service.itemIdField    || 'id';

	var loadedItemsSearchText = null;
	var loadedItemsCompletely = false;

	service.label = service.label || service.defaultPickerLabel;

	if (service.loadItems && !service.loadOnTyping) {
		reload();
	}

	service.getTitle                       = getTitle;
	service.getId                          = getId;
	service.autoCompleteSearch             = autoCompleteSearch;
	service.autoCompleteSearchText         = null;
	service.autoCompleteSelectedItemChange = autoCompleteSelectedItemChange;
	service.autoCompleteSearchTextChange   = autoCompleteSearchTextChange;
	service.setNotFoundButtonAvailability  = setNotFoundButtonAvailability;
	service.resetItemsCache                = resetItemsCache;
	service.availableNotFoundButton        = false;


	service.onValueChanging = function(value) {
		if (service.internalSet) {
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
				if (service.loadOnTyping) {
					//try get Display Strings

					service.setSelectedItems(_valuesToItems(valueArray));
					return value;
				}
				var items = service.items;

				if (items && items.length > 0) {

					var selectedItems = [];
					for(var i = 0; i < items.length; i++) {
						if (valueArray.indexOf(service.getId(items[i])) >= 0) {
							selectedItems.push(items[i]);

							if (selectedItems.length === valueArray.length) {
								break;
							}
						}
					}

					service.setSelectedItems(selectedItems);
					return service.selectedItemsToValue();
				} else if(service.isLoading) {
					_tempValue = value;
					service.setSelectedItems(Array.isArray(value) ? value : [value]);
					return value;
				}
			}
		}

		service.setSelectedItems([]);
		return null;
	};

	service.setNotFoundButtonAvailability();

	service.notFoundClick = function() {
		if(service.notFound && service.notFound.buttonClick) {
			service.notFound.buttonClick();
			service.availableNotFoundButton = false;
			loadedItemsCompletely      = false;
			loadedItemsSearchText      = '';
			//reload items list
			service.searchInput.focus();
		}

		return true;
	};

	function setNotFoundButtonAvailability(makeCall) {
		if (service.notFound) {
			var isConfigured = typeof service.notFound.buttonClick === 'function';
			if (!service.availableNotFoundButton && isConfigured && makeCall) {
				service.notFound.buttonClick(true);
			}
			service.availableNotFoundButton = isConfigured;
		}
	}

	Object.defineProperty(service, '_isTyping', {
		get: function () {
			return _isAutoTyping;
		},
		set: function (value) {
			_isAutoTyping = value;
			if(service.TypingChanged) {
				service.TypingChanged();
			}
		}
	});

	service.searchInput = null;

	$timeout(function() {
		// service.searchInput = $element.find('input');
	});

	// mx.components.FormControlControllerBase.call(this, internationalization, $timeout);

	return service;

// ================================================================================

	function _valuesToItems(values) {
		var items = values.map(function(val) {
			var item             = {};
			item[service.itemIdField] = val;
			return item;
		});

		service.loadItems(null, service, items);
		return items;
	}

	function getId(item) {
		if (service.itemsIsPlainArray) {
			return item;
		}
		if (!item) {
			return null;
		}
		return item[service.itemIdField];
	}

	function getTitle(item) {
		if (service.itemsIsPlainArray) {
			return item;
		}
		if (!item) {
			return null;
		}
		return item[service.itemTitleField];
	}

	function setModelInternal(value) {
		service.internalSet = true;
		service.model       = value;
		service.internalSet = false;
	}

	function reload() {
		var searchText = service.autoCompleteSearchText ? service.autoCompleteSearchText.toLowerCase() : '';

		if (loadedItemsSearchText && searchText.startsWith(loadedItemsSearchText) && (loadedItemsCompletely || searchText.length === loadedItemsSearchText.length)) {
			if (loadedItemsSearchText !== searchText) {
				service.items = filterItemsByTitle(searchText);
			}
			return service.items;
		}

		return reloadAsync(searchText).then(function (data) {
			loadedItemsSearchText = null;
			var items = [];
			if (Array.isArray(data)) {
				items = data;
			}
			else if (data && data.items) {
				items                 = data.items;
				loadedItemsSearchText = data.searchText;
				loadedItemsCompletely = data.all;
			}

			service.items = filterSelectedItems(items);

			return service.items;
		});
	}

	function filterSelectedItems(items) {
		if (service.extraFilterSelectedItems) {
			items = service.extraFilterSelectedItems(items);
		}
		return items;
	}

	function resetItemsCache() {
		loadedItemsSearchText = null;
		loadedItemsCompletely = false;
	}

	function reloadAsync(searchText) {
		service.isLoading = true;
		return service.loadItems(searchText, service);
	}

	function autoCompleteSearch() {
		if (service.loadOnTyping && service.loadItems) {
			if (!service.autoCompleteSearchText) {
				return [];
			}
			return reload();
		} else {
			return filterItemsByTitle(service.autoCompleteSearchText);
		}
	}

	function filterItemsByTitle(query) {
		query = (query || '').toLowerCase();
		var filteredItems = query ? service.items.filter(function (item) {
			return getTitle(item).toLowerCase().indexOf(query) !== -1;
		}) : service.items;

		return filterSelectedItems(filteredItems);
	}

	function autoCompleteSelectedItemChange(item) {
		var itemValue = item ? getId(item) : null;
		if (itemValue !== service.model) {
			if (!itemValue) {
				if (service._isTyping) {
					valueReset = true;
					return;
				}
			}

			_setAutoCompleteValue(itemValue);
		} else if(item === undefined) {
			service.autoCompleteSearchText = null;
		}

		valueReset = false;
	}

	function _setAutoCompleteValue(value) {
		if (service.setAutoCompleteValue) {
			service.internalSet = true;
			service.setAutoCompleteValue(value);
			if (!value) {
				service.autoCompleteSearchText = null;
			}
			service.internalSet = false;
		}

	}

	function autoCompleteSearchTextChange() {
		if (typeof service._isTyping === 'undefined') {
			service._isTyping = true;

			service.searchInput.on('focus', function() {
				service._isTyping = true;
			});

			service.searchInput.on('blur', function() {
				service._isTyping = false;
				if (valueReset) {
					$timeout(function() {
						if (valueReset) {
							valueReset = false;
							_setAutoCompleteValue(null);
						}
					}, 500);
				}
				else {
					if (service.autoCompleteSearchText && !service.model) {
						$timeout(function() {
							if (!service.model) {
								service.autoCompleteSearchText = null;
							}
						}, 300);
					}
				}
			});
		}
	}

  }

})();

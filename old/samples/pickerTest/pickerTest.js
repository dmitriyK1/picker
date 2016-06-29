(function () {
	'use strict';
	angular.module('app').controller('PickerTestController', PickerTestController);

	PickerTestController.$inject = ['$q', '$timeout', 'mx.internationalization', '$scope'];

	function PickerTestController($q, $timeout, internationalization, $scope) {
		var vm          = this;
		vm.readOnly     = true;
		vm.isDisabled   = true;
		vm.valueHistory = [];
		var pickerData  = [];

		for (var i = 1; i < 1000; i++) {
			pickerData.push({id: i, title: 'C@#$%^&*_+~}":?<MЁ!"№;%:?*()_+/ЪЭ,_ä' + i});
		}

		vm.pickerData        = pickerData;
		vm.pickerValue       = 2;
		vm.pickerArray       = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6'];
		vm.pickerArrayValue  = 'Item5';
		vm.pickerArray2      = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6'];
		vm.pickerArrayValue2 = 'Item3';

		vm.selectedLanguage = internationalization.language;

		if (vm.selectedLanguage) {
			internationalization.language = vm.selectedLanguage;
		}
		vm.languages = ['en', 'de'];

		$scope.$watch('vm.selectedLanguage', function (newVal) {
			if (newVal === internationalization.language) {
				return;
			}

			vm.refresh                    = true;
			internationalization.language = vm.selectedLanguage;

			$timeout(function () {
				vm.refresh = false;
			});
		});

		vm.localization = {
			'userInput.required': 'User name must be populated with some data',
			'custValidation.error': 'change user to 123'
		};

		var items = [
			{
				Value: 1,
				DisplayString: 'ABA'
			},
			{
				Value: 2,
				DisplayString: 'ABC'
			},
			{
				Value: 3,
				DisplayString: 'BBC'
			},
			{
				Value: 4,
				DisplayString: 'BAC'
			},
			{
				Value: 5,
				DisplayString: 'BCS'
			},
			{
				Value: 6,
				DisplayString: 'AAA'
			}
		];

		vm.pickerItems = items;
		vm.pickerSelectedItem = 1;
		//vm.pickerLoadOnTypingValue = items[0];

		vm.navigateSelectedItem = function (item) {
			var newItem = item;
			newItem.$$hashKey = 'hashKey';
			alert(JSON.stringify(newItem));
		};

		vm.loadItems = function (searchText) {

			console.log(searchText);
			if (!vm.entityClassName) {
				return $q.when([]);
			}
			var res = [];
			items.forEach(function (item) {
				if (item.DisplayString.toLowerCase().startsWith(searchText)) {
					res.push(item);
				}
			});

			return $q.when({items: res, searchText: searchText});


			//return mxEntityService.getFragments(vm.entityClassName, vm.filterExpression, searchText);
		};
	}

})();

(function(w) {
    'use strict';

    angular
        .module('app')
        .controller('DemoCtrl', DemoCtrl)

    function DemoCtrl($q) {
        var vm        = this;

        vm.isReadOnly = false;
        vm.isDisabled = false;
        vm.isRequired = true;

        vm.notFoundDescriptor = 'Value not found';
        vm.selectedItem      = 'Broccoli';
        vm.autocompleteItems = ['Broccoli', 'Cabbage', 'Carrot', 'Lettuce', 'Spinach', 'Cherry', 'Apple'];
        vm.onChange          = onChange;

        vm.selectedItems = [];

        function onChange() {
            console.log('search item changed');
        }

        // --------------------------------------------------------------------------------

        // ng-model attribute
        vm.pickerValue = 2;

        // items attribute
        vm.pickerData = [{
            id: 1,
            title: 'item 1'
        }, {
            id: 2,
            title: 'item 2'
        }, {
            id: 3,
            title: 'item 3'
        }, {
            id: 4,
            title: 'item 4'
        }, {
            id: 104,
            title: 'filtered item 1'
        }, {
            id: 105,
            title: 'filtered item 2'
        }];

        // --------------------------------------------------------------------------------

        // ng-model attribute
        vm.pickerArrayValue = 'Item5';

        // items attribute
        vm.pickerArray      = ['Item1', 'Item2', 'Item3', 'Item4', 'Item5', 'Item6'];

        // --------------------------------------------------------------------------------

        var items = [{
            Value: 1,
            DisplayString: 'ABA',
            Description: 'Details for ABA'
        }, {
            Value: 2,
            DisplayString: 'ABC',
            Description: 'Details for ABC'
        }, {
            Value: 8,
            DisplayString: 'Absolutely long Display String',
            Description: 'Details for Absolutely long Display String'
        }, {
            Value: 3,
            DisplayString: 'BBC',
            Description: 'Details for BBC'
        }, {
            Value: 4,
            DisplayString: 'BAC',
            Description: 'Details for BAC'
        }, {
            Value: 5,
            DisplayString: 'BCS',
            Description: 'Details for BCS'
        }, {
            Value: 6,
            DisplayString: 'AAA',
            Description: 'Details for AAA'
        }, {
            Value: 7,
            DisplayString: 'ABZ',
            Description: 'Details for ABZ'
        }];

        // ng-model attribute
        vm.pickerLoadOnTypingValue = 5;

        // load-items attribute
        vm.loadItems               = loadItems;

        // navigate-item attribute
        vm.navigateSelectedItem    = navigateSelectedItem;

        // browse-lookup attribute
        vm.browseLookup            = browseLookup;

        // --------------------------------------------------------------------------------

        // load-items attribute
        function loadItems(searchText, ctrl, itms) {
            if (itms) {
                itms.forEach(function(itm) {
                    items.forEach(function(item) {
                        if (item.Value === itm.Value) {
                            itm.DisplayString = item.DisplayString;
                        }
                    });
                });
            } else {
                var res = [];

                items.forEach(function(item) {
                    if (item.DisplayString.toLowerCase().startsWith(searchText)) {
                        res.push(item);
                    }
                });
                var retr = res.slice(0, 3);
                return $q.when({
                    items: retr,
                    searchText: searchText,
                    all: res.length !== retr.length
                });
            }
        }

        // navigate-item attribute
        function navigateSelectedItem(item) {
            alert('Navigate: ' + JSON.stringify(item));
        }

        // browse-lookup attribute
        function browseLookup() {
            if (confirm('Add items?')) {
                return $q.when(vm.pickerData[2]);
            } else {
                return $q.when();
            }
        }


    }

})(window);

angular
    .module('app')
    .controller('DemoCtrl', DemoCtrl)

function DemoCtrl() {
    var vm = this;

    vm.autocompleteItems = ['Broccoli', 'Cabbage', 'Carrot', 'Lettuce', 'Spinach'];
    vm.searchText        = '';
    vm.isDisabled        = false;
    vm.isRequired        = false;
    vm.cache             = false;
    vm.onSearchClick     = onSearchClick;
    vm.onCreateClick     = onCreateClick;

    function onCreateClick(searchText) {
        alert('creating...: ' + searchText);
    }

    function onSearchClick() {
        alert('search...');
    }

}



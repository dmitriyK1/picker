
ng-focus=

function onFocusIn(e) {
    var inputValue = e.target.value;

    if (inputValue.trim().length === 0) {
        e.target.value = e.target.value.trim();
    }
}

// autocomplete-popover
scope.doubleClick = function() {
    var input = element.find('input')[0];

    input.focus();
    input.setSelectionRange(0, input.value.length);
};


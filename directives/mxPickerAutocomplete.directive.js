
ng-focus=

function onFocusIn(e) {
    var inputValue = e.target.value;

    if (inputValue.trim().length === 0) {
        e.target.value = e.target.value.trim();
    }
}



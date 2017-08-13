function $(selector) {
    return angular.element(document.querySelector(selector));
}

function currentTerm() {
    var date = new Date(), month = date.getMonth() + 1;
    return date.getFullYear() + (month > 7 ? '10' : month < 6 ? '20' : '30');
}
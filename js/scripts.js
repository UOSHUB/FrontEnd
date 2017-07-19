function load(file, secure) {
    return {
        requiresLogin: secure,
        templateUrl: file + '.html',
        controller: file
    };
}

function $(selector) {
    return angular.element(document.querySelector(selector));
}
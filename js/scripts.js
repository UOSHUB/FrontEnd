function load(file, secure) {
    return {
        requiresLogin: secure,
        templateUrl: '/static/' + file + '.html',
        controller: file
    };
}

function $(selector) {
    return angular.element(document.querySelector(selector));
}
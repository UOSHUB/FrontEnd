var requested = {}, head = $("head");

function load(file, secure) {
    return {
        requiresLogin: secure,
        templateUrl: file + '.html',
        controller: file,
        resolve: {
            function($http) {
                if(!requested[file]) {
                    head.append('<link rel="stylesheet" href="css/' + file + '.css">');
                    requested[file] = $http.get('js/' + file + '.js')
                        .then(function(response) {
                            eval(response.data);
                        });
                }
                return requested[file];
            }
        }
    };
}

function $(selector) {
    return angular.element(document.querySelector(selector));
}
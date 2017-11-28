app.directive("submit", ["$http", "$timeout", "$toast",

function ($http, $timeout, $toast) {
    return {
        link: function ($scope, element, attr) {
            $timeout(function() {
                var input = element.find("input");
                input.bind("change", function() {
                    var files = new FormData();
                    angular.forEach(input[0].files, function(file, index) {
                        files.append("file" + index, file);
                    });
                    $http.post("/api/submit/" + attr.submit, files, {
                        headers: {"Content-Type": undefined}
                    }).then(function () {
                        $toast("Submitted files successfully");
                    }, function() {
                        $toast("Faild to submit files!");
                    });
                });
                element.on("click", function() {
                    input[0].click();
                });
            });
        }
    };
}]);
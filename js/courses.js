app.controller("courses", ["$scope", "$ls", "$http", "$cards", "$refresh", "$toolbar",

function($scope, $ls, $http, $cards, $refresh, $toolbar) {
    $cards.classes.getData(true);
    $toolbar.term = term;

    if(!$ls.documents)
        $http.get("/api/terms/" + term + "/documents/").then(function(response) {
            $ls.documents = response.data;
        }, error);

    $scope.mass = false;
    $scope.all = false;

    $scope.openFile = function(doc) {
        var link = angular.element("<a href='" + doc.url + "' name='" + doc.file + "' target='_blank'></a>");
        body.append(link);
        link[0].click();
        link.remove();
    };

    $scope.downloadFiles = function() {
        angular.forEach($(".download"), function(file) {
            if(file.querySelector("md-checkbox").classList.contains("md-checked"))
                file.querySelector("a").click();
        });
    };

    $refresh(["content", "updates"])
}]);
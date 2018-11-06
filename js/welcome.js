app.controller("welcome", ["$scope", "$interval", "$http", "$ls", "$goto",

function($scope, $interval, $http, $ls, $goto) {
    $scope.counter = 0;
    $interval(function() {
        $scope.counter++;
        $scope.counter %= 5;
    }, 2000);

    $scope.startDemo = function() {
        $http.get("/api/demo/").then(function(response) {
            $ls.$default(angular.merge({
                session: { version: version },
                selected: {
                    term: term,
                    email: [],
                    tab: 0
                }}, response.data));
            $goto("dashboard");
        });
    };
}]);
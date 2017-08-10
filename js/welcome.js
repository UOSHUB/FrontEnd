app.controller('welcome', ["$scope", "$interval",

function($scope, $interval) {
    $scope.counter = 0;
    $interval(function() {
        $scope.counter++;
        $scope.counter %= 5;
    }, 2000);
}]);
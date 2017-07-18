app.controller('welcome', function($scope, $interval) {
    $scope.images = ["dashboard", "schedule", "courses", "email", "calendar"];
    $scope.counter = 0;
    $interval(function() {
        $scope.counter++;
        $scope.counter %= 5;
    }, 2000);
});
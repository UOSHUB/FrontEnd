app.controller("layout", ["$scope", "$ls", "$toolbar", "$goto", "$http",

function($scope, $ls, $toolbar, $goto, $http) {
    var toolbars = ["dashboard", "schedule", "courses", "email", "calendar"];
    $scope.$on("$routeChangeSuccess", function(event, current) {
        $scope.currentPage = current.$$route.controller;
        $scope.hasToolbar = toolbars.indexOf($scope.currentPage) > -1;
    });
    angular.extend($scope, {
        $toolbar: $toolbar,
        goto: $goto,
        $ls: $ls
    });
    $scope.pages = {
        dashboard: "tachometer",
        schedule: "calendar",
        courses: "book",
        email: "envelope",
        calendar: "globe"
    };
}]);
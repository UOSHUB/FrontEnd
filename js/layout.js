app.controller("layout", ["$scope", "$ls", "$toolbar", "$goto", "$http", "$mdSidenav", "$mdMedia",

function($scope, $ls, $toolbar, $goto, $http, $mdSidenav, $mdMedia) {
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
    $scope.toggleSidenav = function() {
        if($mdMedia("gt-sm"))
            $ls.selected.tightNav = !$ls.selected.tightNav;
        else {
            $mdSidenav("sidenav").toggle();
            $ls.selected.tightNav = false;
        }
    };
}]);
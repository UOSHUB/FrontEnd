app.controller("layout", ["$scope", "$ls", "$toolbar", "$goto", "$http", "$mdSidenav", "$mdMedia",

function($scope, $ls, $toolbar, $goto, $http, $mdSidenav, $mdMedia) {
    var toolbars = ["dashboard", "schedule", "courses", "email", "calendar"];
    $scope.$on("$routeChangeStart", function(event, next) {
        if(next.$$route && next.$$route.controller == "welcome" && $ls.loggedIn)
            $goto("/dashboard/");
    });
    $scope.$on("$routeChangeSuccess", function(event, current) {
        $scope.currentPage = current.$$route ? current.$$route.controller : null;
        $scope.hasToolbar = toolbars.indexOf($scope.currentPage) > -1;
    });
    angular.extend($scope, {
        $toolbar: $toolbar,
        $media: $mdMedia,
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
    $scope.toggleSidenav = function(burgerButton) {
        if(!$mdMedia("gt-sm"))
            $mdSidenav("sidenav").toggle();
        else if(burgerButton)
            $ls.selected.tightNav = !$ls.selected.tightNav;
    };
}]);
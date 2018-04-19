app.controller("layout", ["$scope", "$ls", "$toolbar", "$goto", "$http", "$mdSidenav", "$mdMedia", "$mdColors", "$cards",

function($scope, $ls, $toolbar, $goto, $http, $mdSidenav, $mdMedia, $mdColors, $cards) {
    $scope.$on("$routeChangeStart", function(event, next) {
        if(next.$$route && next.$$route.controller == "welcome" && $ls.loggedIn)
            $goto("dashboard");
    });
    $scope.$on("$routeChangeSuccess", function(event, current) {
        $scope.currentPage = current.$$route ? current.$$route.controller : null;
        $scope.hasToolbar = Object.keys($scope.pages).indexOf($scope.currentPage) > -1;
    });
    angular.extend($scope, {
        $toolbar: $toolbar,
        $media: $mdMedia,
        $cards: $cards,
        goto: $goto,
        $ls: $ls
    });
    $scope.pages = {
        dashboard: "tachometer",
        schedule: "calendar",
        courses: "book",
        emails: "envelope",
        calendar: "globe"
    };
    $scope.getColor = function(card) {
        var color = $cards[card].color;
        return $mdColors.getThemeColor(
            color.slice(0, -3) + "3" + color.slice(-2)
        );
    };
    $scope.toggleSidenav = function(burgerButton) {
        if(!$mdMedia("gt-sm"))
            $mdSidenav("sidenav").toggle();
        else if(burgerButton)
            $ls.selected.tightNav = !$ls.selected.tightNav;
    };
}]);
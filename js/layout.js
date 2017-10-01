app.controller('layout', ["$scope", "$ls", "$toolbar", "$goto", "$http",

function($scope, $ls, $toolbar, $goto, $http) {
    var toolbars = ['schedule', 'courses', 'email', 'calendar'];
    $scope.$on('$routeChangeSuccess', function(event, current) {
        $scope.currentPage = current.$$route.controller;
        $scope.hasToolbar = toolbars.indexOf($scope.currentPage) > -1;
    });
    angular.extend($scope, {
        $toolbar: $toolbar,
        goto: $goto,
        $ls: $ls.$default({
            selected: {}
        })
    });
    $scope.pages = {
        dashboard: 'tachometer',
        schedule: 'calendar',
        courses: 'book',
        email: 'envelope',
        calendar: 'globe'
    };
    $scope.logout = function() {
        $http({method: "delete", url: "/api/login/"}).then(function(response) {
            $ls.loggedIn = false;
            if($scope.currentPage != 'calendar')
                $goto('/');
            }, function(response) {});
    };
}])

.factory('$toolbar', function() {
    return {};
});
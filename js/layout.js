app.controller('layout', ["$scope", "$ls", "$toolbar", "$goto",

function($scope, $ls, $toolbar, $goto) {
    var toolbars = ['schedule', 'courses', 'email', 'calendar'];
    $scope.$on('$routeChangeSuccess', function(event, current) {
        $scope.currentPage = current.$$route.controller;
        $scope.hasToolbar = toolbars.indexOf($scope.currentPage) > -1;
    });
    angular.extend($scope, {
        $toolbar: $toolbar,
        goto: $goto,
        $ls: $ls
    });
    $scope.pages = {
        dashboard: 'tachometer',
        schedule: 'calendar',
        courses: 'book',
        email: 'envelope',
        calendar: 'globe'
    };
    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    $scope.logout = function() {
        $ls.loggedIn = false;
        if($scope.currentPage != 'calendar')
            $goto('/');
    };
}])

.factory('$toolbar', function() {
    return {};
});
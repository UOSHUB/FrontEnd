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
            terms: {},
            emails: {},
            selected: {
                term: (function() {
                    var month = today.getMonth() + 1;
                    return today.getFullYear() + (month > 7 ? '10' : month < 6 ? '20' : '30');
                })()
            }
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
    $scope.getInitials = function(name) {
        if(!name) return;
        var words = name.split(' ');
        return (
            words[1] ?
            words[0].slice(0, 1) + words[1].slice(0, 1):
            words[0].slice(0, 2)
        ).toUpperCase();
    };
}])

.factory('$toolbar', function() {
    return {};
});
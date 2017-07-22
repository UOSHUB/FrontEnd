app.controller('layout', ["$scope", "$mdDialog", "$rootScope", "$localStorage", "$location",

function($scope, $mdDialog, $rootScope, $localStorage, $location) {
    $scope.links = [{
        title: 'dashboard',
        icon: 'tachometer'
    }, {
        title: 'schedule',
        icon: 'calendar'
    }, {
        title: 'courses',
        icon: 'book'
    }, {
        title: 'email',
        icon: 'envelope'
    }, {
        title: 'calendar',
        icon: 'globe'
    }];
    $scope.capitalize = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    $scope.cancel = $mdDialog.cancel;
    $scope.hide = $mdDialog.hide;
    $scope.login = function(event) {
        $mdDialog.show({
            templateUrl: 'login-dialog',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            preserveScope: true,
            targetEvent: event,
            scope: $scope
        }).then(function() {
            $localStorage.loggedIn = true;
            $rootScope.redirect('/dashboard/');
        }, function(){
            $localStorage.sid = null;
        });
    };
    $scope.logout = function() {
        $localStorage.sid = null;
        $localStorage.loggedIn = false;
        if($location.path() != "/calendar/")
            $rootScope.redirect('/');
    };
    $scope.semesters = [
        "Spring Semester 2016 - 2017",
        "Fall Semester 2016 - 2017",
        "Spring Semester 2015 - 2016",
        "Fall Semester 2015 - 2016"
    ];
    $scope.setDirection = function(direction) {
        $localStorage.direction = direction;
        $localStorage.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };
}]);
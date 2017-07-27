app.controller('layout', ["$scope", "$rootScope", "$ls", "$location",

function($scope, $rootScope, $ls, $location) {
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

    $scope.logout = function() {
        $ls.loggedIn = false;
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
        $ls.direction = direction;
        $ls.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };
}])


.directive('login', ["$mdDialog", "$http", "$ls",

function($mdDialog, $http, $ls) {
    return {
        link: function($scope, element, attrs) {
            $scope.cancel = $mdDialog.cancel;
            $scope.submit = $mdDialog.hide;
            element.on('click', function($event) {
                $mdDialog.show({
                    templateUrl: '/static/login.html',
                    clickOutsideToClose: true,
                    preserveScope: true,
                    targetEvent: $event,
                    parent: $('body'),
                    scope: $scope
                }).then(function(data) {
                    if(!$ls.name) data.new = true;
                    $http.post("/api/login/", data).then(function(response) {
                        angular.extend($ls, response.data, {loggedIn: true});
                    }, function(response) {
                        element.triggerHandler('click');
                    });
                }, function() {});
            });
        }
    }
}]);
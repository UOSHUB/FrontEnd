app.controller('layout', ["$scope", "$ls", "$location", "$goto",

function($scope, $ls, $location, $goto) {
    var toolbars = ['schedule'];
    $scope.$on('$routeChangeSuccess', function(event, current) {
        $scope.toolbar = toolbars[toolbars.indexOf(current.$$route.controller)];
    });

    angular.extend($scope, {
        $loc: $location,
        goto: $goto,
        $ls: $ls
    });
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
            $goto('/');
    };
    $scope.setDirection = function(direction) {
        $ls.direction = direction;
        $ls.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };
}])


.directive('login', ["$mdDialog", "$http", "$ls", "$goto",

function($mdDialog, $http, $ls, $goto) {
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
                    $http.post("/api/login/", data).then(function(response) {
                        $ls.loggedIn = true;
                        $goto('dashboard');
                        if(!$ls.name)
                            $http.get("/api/details/").then(function(response) {
                                angular.extend($ls, response.data);
                            }, function() {});
                    }, function(response) {
                        element.triggerHandler('click');
                    });
                }, function() {});
            });
        }
    }
}]);
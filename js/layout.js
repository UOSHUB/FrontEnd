app.controller('layout', ["$scope", "$ls", "$goto",

function($scope, $ls, $goto) {
    var toolbars = ['schedule', 'courses', 'email', 'calendar'];
    $scope.$on('$routeChangeSuccess', function(event, current) {
        $scope.page = current.$$route.controller;
        $scope.hasToolbar = toolbars.indexOf($scope.page) > -1;
    });
    angular.extend($scope, {
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
        if($scope.page != 'calendar')
            $goto('/');
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
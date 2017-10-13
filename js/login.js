app.directive('login', ["$mdDialog", "$http", "$ls", "$goto",

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
                    parent: body,
                    scope: $scope
                }).then(function(data) {
                    $http.post("/api/login/", data).then(function(response) {
                        $ls.loggedIn = true;
                        $goto('dashboard');
                        if(!$ls.student)
                            $http.get("/api/details/").then(function(response) {
                                angular.extend($ls, response.data);
                            }, error);
                    }, function(response) {
                        element.triggerHandler('click');
                    });
                }, error);
            });
        }
    }
}])
app.controller('Welcome', function($scope, $interval, $mdDialog, $localStorage) {
    $scope.slideshow = "img/dashboard.png";
    $scope.counter = 1;
    $interval(function() {
        $scope.slideshow = "img/" + ["dashboard", "schedule", "courses", "email", "calendar"][$scope.counter] + ".png";
        $scope.counter = ($scope.counter + 1) % 5;
    }, 2000);
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
            $rootScope.redirect('dashboard');
        }, function(){
            $localStorage.sid = null;
        });
    };
});
app.directive("account", ["$mdPanel", "$http", "$ls", "$goto", "$rootScope", "$interval",

function($mdPanel, $http, $ls, $goto, $rootScope, $interval) {
    return {
        link: function($scope, element) {
            var panelOptions = {
                scope: $scope,
                clickOutsideToClose: true,
                templateUrl: "/static/account.html",
                panelClass: "account-panel md-whiteframe-2dp",
                animation: $mdPanel.newPanelAnimation()
                    .openFrom(element)
                    .withAnimation($mdPanel.animation.SCALE),
                position: $mdPanel.newPanelPosition()
                    .absolute().top("0").end("0")
            };
            element.on("click", function($event) {
                $mdPanel.open(panelOptions).then(function(panel) {
                    $scope.panel = panel;
                });
            });
            $scope.logout = function() {
                $http({method: "delete", url: "/api/login/"}).then(nothing, error);
                $scope.panel.close().then(function() {
                    var reset = {};
                    if($scope.currentPage != "calendar")
                        $goto("/");
                    else reset = {
                        selected: {calDir: $ls.selected.calDir},
                        events: $ls.events
                    };
                    element.addClass("ng-hide");
                    if($rootScope.refresh) {
                        $interval.cancel($rootScope.refresh);
                        delete $rootScope.refresh;
                    }
                    $ls.$reset(reset);
                }, error);
            };
            if($ls.session && version !== $ls.session.version)
                $scope.logout();
        }
    };
}])
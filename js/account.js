app.directive("account", ["$mdPanel", "$http", "$ls", "$goto", "$rootScope", "$interval", "$toast",

function($mdPanel, $http, $ls, $goto, $rootScope, $interval, $toast) {
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
            $scope.subscribe = function(remove) {
                $http({method: remove ? "delete" : "post", url: "/api/subscribe/"}).then(function() {
                    $scope.panel.close().then(function() {
                        if(remove) $toast("Unsubscribed successfully");
                        else $toast("Subscribed! You should get an email soon");
                        $ls.student.subscribed = !remove;
                    }, error);
                }, function() {
                    $scope.panel.close().then(function() {
                        $toast("Something went wrong! try again later");
                    }, error);
                });
            };
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
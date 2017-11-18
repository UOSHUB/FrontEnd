app.directive("account", ["$mdPanel", "$http", "$ls", "$goto",

function($mdPanel, $http, $ls, $goto) {
    return {
        link: function($scope, element, attrs) {
            var panelOptions = {
                scope: $scope,
                clickOutsideToClose: true,
                templateUrl: "/static/account.html",
                panelClass: "account-panel md-whiteframe-2dp",
                animation: $mdPanel.newPanelAnimation()
                    .openFrom(element)
                    .withAnimation($mdPanel.animation.SCALE),
                position: $mdPanel.newPanelPosition()
                    .relativeTo(element)
                    .addPanelPosition(
                        $mdPanel.xPosition.OFFSET_END,
                        $mdPanel.yPosition.ALIGN_TOPS
                    )
            };
            element.on("click", function($event) {
                $mdPanel.open(panelOptions).then(function(panel) {
                    $scope.panel = panel;
                });
            });
            $scope.logout = function() {
                $http({method: "delete", url: "/api/login/"}).then(function(response) {
                    if($scope.currentPage != "calendar")
                        $goto("/");
                    }, error);
                $ls.loggedIn = false;
                $scope.panel.close();
            };
            $scope.cleanLogout = function() {
                $scope.logout();
                $ls.$reset();
            };
        }
    };
}])
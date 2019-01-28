app.controller("dashboard", ["$scope", "$refresh", "$toolbar", function($scope, $refresh, $toolbar) {
    $toolbar.thisTerm = term;

    $scope.cards = [
        ["updates", "courses"], "deadlines",
        ["classes", "holds"]
    ];

    $refresh(["content=deadlines", "updates"]);
}]);
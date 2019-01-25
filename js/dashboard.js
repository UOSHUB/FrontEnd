app.controller("dashboard", ["$scope", "$refresh", "$toolbar", function($scope, $refresh, $toolbar) {
    $toolbar.thisTerm = term;

    $scope.cards = [
        ["updates", "deadlines"], "classes",
        ["holds", "courses"]
    ];

    $refresh(["content=deadlines", "emails=personal", "updates"]);
}]);
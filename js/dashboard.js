app.controller("dashboard", ["$scope", "$refresh", "$toolbar", "$cards", function($scope, $refresh, $toolbar, $cards) {
    $toolbar.thisTerm = term;

    $scope.cards = [
        ["updates", "deadlines"], "emails",
        ["finals", "grades"]
    ];

    $refresh(["content=deadlines", "emails=personal", "updates", "grades"])
}]);
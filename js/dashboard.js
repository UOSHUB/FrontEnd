app.controller("dashboard", ["$scope", "$refresh", "$toolbar", function($scope, $refresh, $toolbar) {
    $toolbar.thisTerm = term;

    $scope.cards = [
        ["updates", "deadlines"], "emails",
        ["finals", "grades"]
    ];

    $refresh(["content=deadlines", "emails=personal", "updates", "grades"])
}]);
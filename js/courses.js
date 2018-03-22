app.controller("courses", ["$scope", "$cards", "$refresh", "$toolbar",

function($scope, $cards, $refresh, $toolbar) {
    $cards.classes.getData(true);
    $scope.$cards = $cards;
    $toolbar.term = term;

    $scope.cards = [
        "deadlines", "updates", "documents", "info", "mailto"
    ];

    $refresh(["content", "updates"])
}]);
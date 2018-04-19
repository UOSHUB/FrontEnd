app.controller("courses", ["$scope", "$refresh", "$toolbar",

function($scope, $refresh, $toolbar) {
    $toolbar.term = term;

    $scope.cards = [
        "deadlines", "updates", "documents", "info", "mailto"
    ];

    $refresh(["content", "updates"])
}]);
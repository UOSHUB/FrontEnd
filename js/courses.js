app.controller("courses", ["$scope", "$cards", "$refresh", "$toolbar",

function($scope, $cards, $refresh, $toolbar) {
    $cards.classes.getData(true);
    $toolbar.term = term;

    $refresh(["content", "updates"])
}]);
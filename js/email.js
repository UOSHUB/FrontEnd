app.controller('email', ["$scope", "$ls", "$http",

function($scope, $ls, $http) {
    $scope.tabs = ["personal", "courses", "events"];

    if(!$ls.selected.tab)
        $ls.selected.tab = 0;
    if(!$ls.selected.email)
        $ls.selected.email = [];

    ($scope.getEmails = function(category) {
        $http.get("/api/emails/" + category + "/").then(function(response) {
            angular.extend($ls.emails, response.data);
        }, error);
    })($scope.tabs[$ls.selected.tab]);

    $scope.openEmail = function(tab, id) {
        $ls.selected.email = [tab, id];
    };

    $scope.isSelected = function(tab, id) {
        return $ls.selected.email[0] == tab && $ls.selected.email[1] == id;
    };
}]);
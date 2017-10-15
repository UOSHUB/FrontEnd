app.controller('email', ["$scope", "$ls", "$http",

function($scope, $ls, $http) {
    $scope.tabs = ["personal", "courses", "events"];

    if(!$ls.selected.tab)
        $ls.selected.tab = 0;

    ($scope.getEmails = function(category) {
        $http.get("/api/emails/" + category + "/").then(function(response) {
            var emails = {};
            emails[category] = response.data;
            angular.extend($ls.emails, emails);
        }, error);
    })($scope.tabs[$ls.selected.tab]);

    $scope.openEmail = function(tab, index) {
        $ls.selected.email = [tab, index];
    };

    $scope.isSelected = function(tab, index) {
        return $ls.selected.email[0] == tab && $ls.selected.email[1] == index;
    };

    if(!$ls.selected.email)
        $scope.openEmail("personal", 0);
}]);
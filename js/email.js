app.controller('email', ["$scope", "$ls", "$http", "$refresh",

function($scope, $ls, $http, $refresh) {
    if(!$ls.emails.body)
        $ls.emails.body = {};

    $scope.tabs = ["personal", "courses", "events"];

    ($scope.getEmails = function(category) {
        if(!$ls.emails[category] || $ls.emails[category].length < 20)
            $http.get("/api/emails/" + category + "/").then(function(response) {
                angular.extend($ls.emails, response.data);
            }, error);
    })($scope.tabs[$ls.selected.tab]);

    $scope.openEmail = function(tab, id) {
        $ls.selected.email = [tab, id];
        if(!$ls.emails.body[id])
            $http.get("/api/emails/" + $ls.emails.idRoot + "_" + id + "/").then(function(response) {
                $ls.emails.body[id] = response.data;
            }, error);
    };

    $scope.isSelected = function(tab, id) {
        return $ls.selected.email[0] == tab && $ls.selected.email[1] == id;
    };

    $refresh(["emails"])
}]);
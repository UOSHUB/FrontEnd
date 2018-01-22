app.directive("card", ["$http", "$ls", function($http, $ls) {
    function getData(storage, location, url) {
        return function() {
            if(!storage[location])
                $http.get("/api/" + url + "/").then(function(response) {
                    storage[location] = response.data;
                }, error);
        }
    }
    var cards = {
        deadlines: {
            title: "Deadlines", color: "orange-600", icon: "tasks",
            getData: getData($ls, "deadlines", "terms/" + term + "/deadlines")
        },
        updates: {
            title: "Updates", color: "green-600", icon: "bell",
            getData: getData($ls, "updates", "updates")
        },
        emails: {
            title: "Emails", color: "blue-600", icon: "envelope",
            getData: getData($ls.emails, "personal", "emails/personal/10")
        },
        holds: {
            title: "Holds", color: "red-600", icon: "exclamation-triangle",
            getData: getData($ls, "holds", "holds")
        },
        grades: {
            title: "Grades", color: "teal-600", icon: "graduation-cap",
            getData: getData($ls, "grades", "grades/" + term)
        },
        finals: {
            title: "Final Exams", color: "brown-600", icon: "clipboard",
            getData: getData($ls, "finals", "finals/" + term)
        },
        classes: {
            title: "Today's Classes", color: "lime-700", icon: "flag",
            getData: function() {
                if(!$ls.terms[term])
                    $http.get("/api/terms/" + term + "/").then(function(response) {
                        if(!angular.equals(response.data, {})) {
                            $ls.terms[term] = {};
                            angular.merge($ls.courses, processSchedule(response.data, $ls.terms[term]));
                        }
                    }, error);
            }
        },
    };
    return {
        templateUrl: "/static/cards/layout.html",
        restrict: "E",
        replace: true,
        scope: { template: "=" },
        controller: ["$scope", function($scope) {
            $scope.$ls = $ls;
            $scope.card = cards[$scope.template];
        }]
    };
}]);
app.directive("card", ["$http", "$ls", "$goto", "$filter", function($http, $ls, $goto, $filter) {
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
            getData: getData($ls, "deadlines", "terms/" + term + "/deadlines"),
            beforeDue: function(date) {
                return new Date(date) > today;
            }
        },
        updates: {
            title: "Updates", color: "green-600", icon: "bell",
            getData: getData($ls, "updates", "updates"),
            dismissUpdate: function(updateId) {
                $http({
                    method: "delete",
                    url: "/api/updates/" + updateId + "/"
                }).then(nothing, error);
                find($ls.updates, "dismiss", updateId, "delete");
            }
        },
        emails: {
            title: "Emails", color: "blue-600", icon: "envelope",
            getData: getData($ls.emails, "personal", "emails/personal/10"),
            getInitials: getInitials,
            goToEmail: function(emailId) {
                $ls.selected.tab = 0;
                $ls.selected.email = ["personal", emailId];
                $goto("email");
            },
            deleteEmail: function(emailId) {
                $http({
                    method: "delete",
                    url: "/api/emails/" + emailId + "/"
                }).then(nothing, error);
                $ls.selected.tab = 0;
                $ls.selected.email = [];
                $filter("find")($ls.emails.personal, "id", emailId, "delete");
            }
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
            getData: getData($ls, "finals", "finals/" + term),
            parseDate: function(date) {
                return new Date(date);
            }
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
            },
            todayClasses: function() {
                var classes = [], day = days[today.getDay()];
                if($ls.terms && $ls.terms[term])
                    angular.forEach($ls.terms[term].courses, function(key) {
                        var course = $ls.courses[key];
                        if(course.days && course.days.indexOf(day) > -1)
                            classes.push(course);
                    });
                return classes;
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
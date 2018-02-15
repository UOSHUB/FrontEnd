app.directive("card", ["$http", "$ls", "$goto", "$filter", "$location", function($http, $ls, $goto, $filter, $location) {
    function getData(location, url, parent) {
        return function() {
            var storage = !parent ? $ls : $ls[parent];
            if((storage[location] || []).length == 0)
                $http.get("/api/" + url + "/").then(function(response) {
                    storage[location] = response.data;
                }, error);
        }
    }
    var cards = {
        deadlines: {
            title: "Deadlines", color: "orange-600", icon: "tasks",
            getData: getData("deadlines", "terms/" + term + "/deadlines"),
            beforeDue: function(date) {
                return !date || new Date(date) > today;
            }
        },
        updates: {
            title: "Updates", color: "green-600", icon: "bell",
            getData: getData("updates", "updates"),
            dismissUpdate: function(updateId) {
                $http({
                    method: "delete",
                    url: "/api/updates/" + updateId + "/"
                }).then(nothing, error);
                $filter("find")($ls.updates, "dismiss", updateId, "delete");
            }
        },
        emails: {
            title: "Emails", color: "blue-600", icon: "envelope",
            getData: getData("personal", "emails/personal/10", "emails"),
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
            getData: getData("holds", "holds"),
            parseDate: parseDate
        },
        grades: {
            title: "Grades", color: "teal-600", icon: "graduation-cap",
            getData: getData("grades", "grades/" + term)
        },
        finals: {
            title: "Final Exams", color: "brown-600", icon: "clipboard",
            getData: getData("finals", "finals/" + term),
            parseDate: parseDate
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
        courses: {
            title: "Courses", color: "purple-500", icon: "book",
            getData: nothing, term: term, updatesCount: function(courseId) {
                var count = 0;
                angular.forEach($ls.updates, function(update) {
                    if(update.course == courseId)
                        count++;
                });
                return count;
            },
            goToCourse: function(courseId) {
                $ls.selected.course = courseId;
                $goto("courses");
            }
        }
    };
    return {
        templateUrl: "/static/cards/layout.html",
        restrict: "E",
        replace: true,
        scope: {
            template: "<",
            dynamic: "@"
        },
        controller: ["$scope", function($scope) {
            angular.extend($scope, {$ls: $ls}, cards[$scope.template]);
            if($scope.dynamic)
                $scope.$watch("template", function(newTemplate, oldTemplate) {
                    if(newTemplate != oldTemplate) {
                        angular.extend($scope, cards[newTemplate]);
                        $scope.getData();
                    }
                });
            if($location.path() == "/courses/")
                $scope.inCourse = true;
        }]
    };
}]);
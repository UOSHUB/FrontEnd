app.factory("$cards", ["$ls", "$goto", "$filter", "$http", "$mdDialog", "$toast",

function($ls, $goto, $filter, $http, $mdDialog, $toast) {
    function getData(location, url, parent) {
        return function() {
            var storage = !parent ? $ls : $ls[parent];
            if((storage[location] || []).length == 0)
                $http.get("/api/" + url + "/").then(function(response) {
                    storage[location] = response.data;
                }, error);
        }
    }
    return {
        deadlines: {
            icon: "tasks", getData: getData("deadlines", "terms/" + term + "/deadlines"),
            beforeDue: function(date) {
                return !date || new Date(date) > today;
            }
        },
        updates: {
            icon: "bell", getData: getData("updates", "updates"),
            dismissUpdate: function(updateId) {
                $http({
                    method: "delete",
                    url: "/api/updates/" + updateId + "/"
                }).then(nothing, error);
                $filter("find")($ls.updates, "dismiss", updateId, "delete");
            }
        },
        emails: {
            icon: "envelope", getData: getData("personal", "emails/personal/10", "emails"),
            getInitials: getInitials,
            goToEmail: function(emailId) {
                $ls.selected.tab = 0;
                $ls.selected.email = ["personal", emailId];
                $ls.emailsAction = "view";
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
            icon: "exclamation-triangle",
            getData: getData("holds", "holds"),
            parseDate: parseDate
        },
        grades: {
            icon: "graduation-cap", getData: getData("grades", "grades/" + term),
            gradeColor: function(grade) {
                var percent = grade.grade / grade.outOf * 100;
                if(percent < 60)
                    return "red";
                if(percent < 70)
                    return "orange";
                if(percent < 80)
                    return "yellow";
                if(percent < 90)
                    return "lime";
                return "green";
            }
        },
        finals: {
            getData: getData("finals", "finals/" + term),
            icon: "clipboard", parseDate: parseDate
        },
        documents: {
            icon: "file-text", mass: false, all: false,
            getData: getData("documents", "terms/" + term + "/documents"),
            openFile: function(doc) {
                var link = angular.element("<a href='" + doc.url + "' name='" + doc.file + "' target='_blank'></a>");
                body.append(link);
                link[0].click();
                link.remove();
            },
            downloadFiles: function() {
                angular.forEach($(".download"), function(file) {
                    if(file.querySelector("md-checkbox").classList.contains("md-checked"))
                        file.querySelector("a").click();
                });
            }
        },
        classes: {
            icon: "flag", getData: function(selectCourse) {
                if(!$ls.terms[term])
                    $http.get("/api/terms/" + term + "/").then(function(response) {
                        if(!angular.equals(response.data, {})) {
                            $ls.terms[term] = {};
                            angular.merge($ls.courses, processSchedule(response.data, $ls.terms[term]));
                            if(selectCourse)
                                $ls.selected.course = $ls.terms[term].courses[0];
                        }
                    }, error);
                else if(selectCourse && !$ls.selected.course)
                    $ls.selected.course = $ls.terms[term].courses[0];
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
            icon: "book", getData: nothing,
            term: term, updatesCount: function(courseId) {
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
        },
        info: {
            icon: "info-circle", getData: nothing,
            watchCourse: function($scope) {
                $scope.$watch(function() { return $ls.selected.course; }, function(id) {
                    if(id && $ls.courses[id])
                        $scope.course = structureCourse($ls.courses[id], id);
                });
            }
        },
        mailto: {
            icon: "envelope", getData: nothing,
            sendEmail: function($event, subject, body, course) {
                $mdDialog.show(
                    $mdDialog.confirm()
                        .title("Subject: " + subject)
                        .textContent("To: " + $ls.courses[course].doctor)
                        .targetEvent($event)
                        .clickOutsideToClose(true)
                        .ok("Send it")
                        .cancel("Cancel")
                ).then(function() {
                    $http.post("/api/emails/send/", {
                        subject: subject,
                        body: body,
                        recipients: $ls.courses[course].email
                    }).then(function() {
                        $toast("Your emails has been sent");
                    }, function() {
                        $toast("Failed to send email!");
                    });
                }, nothing);
            }
        }
    };
}])
.directive("card", ["$ls", "$location", "$cards", function($ls, $location, $cards) {
    function loadTemplate(newTemplate, oldTemplate, $scope) {
        if(newTemplate != oldTemplate) {
            $scope.templateURL = "/static/cards/" + newTemplate + ".html";
            angular.extend($scope, $cards[newTemplate]);
            $scope.getData();
        }
    }
    return {
        template: '<md-card ng-include="templateURL" flex></md-card>',
        restrict: "E",
        replace: true,
        scope: {
            template: "<",
            dynamic: "@"
        },
        controller: ["$scope", function($scope) {
            $scope.$ls = $ls;
            loadTemplate($scope.template, null, $scope);
            if($scope.dynamic)
                $scope.$watch("template", loadTemplate);
            if($location.path() == "/courses/")
                $scope.inCourse = true;
        }]
    };
}]);
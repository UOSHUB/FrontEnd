app.factory("$cards", ["$ls", "$goto", "$filter", "$http", "$mdDialog", "$toast",

function($ls, $goto, $filter, $http, $mdDialog, $toast) {
    function getData(location, url, parent) {
        return function() {
            var storage = !parent ? $ls : $ls[parent];
            if((storage[location] || []).length == 0)
                $http.get("/api/" + url + "/").then(function(response) {
                    storage[location] = response.data;
                }, error);
        };
    }
    return {
        deadlines: {
            getData: getData("deadlines", "terms/" + term + "/deadlines"),
            icon: "tasks", beforeDue: function(date) {
                return !date || new Date(date) > today;
            }
        },
        updates: {
            getData: getData("updates", "updates"),
            icon: "bell", dismissUpdate: function(updateId) {
                $http({
                    method: "delete",
                    url: "/api/updates/" + updateId + "/"
                }).then(nothing, error);
                $filter("find")($ls.updates, "dismiss", updateId, "delete");
            }
        },
        emails: {
            getData: getData("personal", "emails/personal/10", "emails"),
            icon: "envelope", getInitials: getInitials,
            goToEmail: function(emailId) {
                $ls.selected.tab = 0;
                $ls.selected.email = ["personal", emailId];
                $ls.emailsAction = "view";
                $goto("emails");
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
            getData: getData("holds", "holds"),
            icon: "exclamation-triangle",
            parseDate: parseDate
        },
        grades: {
            getData: getData("grades", "grades/" + term),
            icon: "graduation-cap", gradeColor: function(grade) {
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
            getData: getData("documents", "terms/" + term + "/documents"),
            icon: "file-text", all: false,
            downloadFile: function(id) {
                document.body.append(
                    angular.element("<iframe src='/api/documents/" + id + "/'></iframe>")[0]
                );
            },
            downloadFiles: function() {
                var $scope = this;
                angular.forEach($(".document-checkbox"), function(checkbox) {
                    if(checkbox.classList.contains("md-checked"))
                        $scope.downloadFile(checkbox.getAttribute("id"));
                });
            },
            downloadZip: function() {
                var ids = [];
                angular.forEach($(".document-checkbox"), function(checkbox) {
                    if(checkbox.classList.contains("md-checked"))
                        ids.push(checkbox.getAttribute("id"));
                });
                this.downloadFile(
                    "zip/" + ids.join(",") + "/" + $ls.courses[$ls.selected.course].title
                );
            }
        },
        classes: {
            icon: "flag", todayClasses: function() {
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
            icon: "book", term: term,
            updatesCount: function(courseId) {
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
            icon: "info-circle", init: true, watchCourse: function($scope) {
                if(!this.init) return;
                $scope.$watch(function() { return $ls.selected.course; }, function(id) {
                    if(id && $ls.courses[id])
                        $scope.course = structureCourse($ls.courses[id], id);
                });
                this.init = false;
            }
        },
        mailto: {
            icon: "envelope", sendEmail: function($event, subject, body, course) {
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
.directive("card", ["$location", "$cards", function($location, $cards) {
    return {
        link: function($scope, element) {
            element.addClass("flex");
            $scope.$on("$includeContentLoaded", function($event, template) {
                angular.extend($scope, $cards[template.slice(14, -5)]);
                ($scope.getData || nothing)();
            });
            if($location.path() == "/courses/")
                $scope.inCourse = true;
        }
    };
}]);
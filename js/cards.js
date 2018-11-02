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
            icon: "tasks", color: "orange-600", beforeDue: function(date) {
                return !date || new Date(date) > today;
            }, nearest: function(deadline) {
                var diff = today - new Date(deadline.dueDate || today);
                return diff >= 0 ? diff : 1 / diff;
            }
        },
        updates: {
            getData: getData("updates", "updates"), icon: "bell", toast: $toast,
            color: "green-600", dismissUpdate: function(updateId) {
                $http({
                    method: "delete",
                    url: "/api/updates/" + updateId + "/"
                }).then(nothing, error);
                $filter("find")($ls.updates, "dismiss", updateId, "delete");
            }
        },
        emails: {
            emailsLoader: {
                loading: ($ls.emails.personal || new Array(10)).length,
                getItemAtIndex: function(index) {
                    if(!$ls.emails.personal) return null;
                    if(index >= $ls.emails.personal.length) {
                        this.getMoreEmails(index);
                        return null;
                    }
                    return $ls.emails.personal[index];
                },
                getLength: function() {
                    return ($ls.emails.personal || []).length + 1;
                },
                getMoreEmails: function(load) {
                    if(load >= this.loading) {
                        $http.get("/api/emails/personal/10/" + this.loading + "/").then(function(response) {
                            $ls.emails.personal = $ls.emails.personal.concat(response.data);
                        }, error);
                        this.loading += 10;
                    }
                }
            },
            getData: getData("personal", "emails/personal", "emails"),
            icon: "envelope", color: "blue-600", getInitials: getInitials,
            goToEmail: function(emailId) {
                $ls.selected.tab = 0;
                $ls.selected.email = ["personal", emailId];
                $ls.emails.action = "view";
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
            color: "red-600", parseDate: parseDate
        },
        grades: {
            getData: getData("grades", "grades/" + term), color: "teal-600",
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
            icon: "clipboard", color: "brown-600", parseDate: parseDate
        },
        documents: {
            getData: getData("documents", "terms/" + term + "/documents"),
            icon: "file-text", color: "brown-600", all: false,
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
            icon: "flag", color: "lime-700", todayClasses: function() {
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
            icon: "book", color: "purple-500", term: term,
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
            icon: "info-circle", color: "pink-500",
            init: true, watchCourse: function($scope) {
                if(!this.init) return;
                $scope.$watch(function() { return $ls.selected.course; }, function(id) {
                    if(id && $ls.courses[id])
                        $scope.course = structureCourse($ls.courses[id], id);
                });
                this.init = false;
            }
        },
        mailto: {
            icon: "envelope", color: "light-blue-500",
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
.directive("card", ["$location", "$cards", "$mdColors", function($location, $cards, $mdColors) {
    return {
        restrict: "A",
        link: function($scope, element) {
            element.addClass("flex");
            $scope.$on("$includeContentLoaded", function($event, template) {
                angular.extend($scope, $cards[template.slice(14, -5)]);
                element.find("md-content").css("height", "100%");
                element.find("md-toolbar").css("background-color", $mdColors.getThemeColor($scope.color));
                ($scope.getData || nothing)();
            });
            if($location.path() == "/courses/")
                $scope.inCourse = true;
        }
    };
}])
.directive("navbar", ["$ls", "$cards", "$mdColors", function($ls, $cards, $mdColors) {
    return {
        templateUrl: "navbar".url(),
        restrict: "E",
        scope: {
            cards: "<",
            select: "@"
        },
        link: function($scope, element, attrs) {
            angular.extend($scope, {
                $ls: $ls,
                $cards: $cards,
                cards: [].concat.apply([], $scope.cards)
            });
            $ls.selected[$scope.select] = $ls.selected[$scope.select] || attrs["default"];
            $scope.$watch(function() { return $ls.selected[$scope.select]; }, function(card) {
                var color = $cards[card].color;
                $scope.color = $mdColors.getThemeColor(
                    color.slice(0, -3) + "3" + color.slice(-2)
                );
            });
        }
    };
}])
.directive("loading", ["$mdColors", function($mdColors) {
    return {
        template: '<div ng-if="!items || items.length === 0" layout="row" flex ' +
                  'layout-align="center center" style="height: 100%; overflow: hidden">' +
            '<md-progress-circular ng-if="!items" md-diameter="80px"></md-progress-circular>' +
            '<h4 ng-if="items && items.length === 0" layout="column" style="color: #90A4AE">' +
            '<md-icon md-font-icon="fa fa-thumbs-up fa-5x" style="height: 64px; color: #B0BEC5"></md-icon>' +
            'Seems there aren\'t any yet!</h4>' +
        '</div>',
        scope: {
            items: "<",
            color: "<"
        },
        link: function($scope, element) {
            element.ready(function() {
                element.find("path").css("stroke", $mdColors.getThemeColor($scope.color));
            });
        }
    };
}]);
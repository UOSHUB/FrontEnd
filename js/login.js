app.directive("login", ["$mdDialog", "$http", "$ls", "$goto",

function($mdDialog, $http, $ls, $goto) {
    var fails = 0;
    function getCourses() {
        if(fails++ < 3)
            $http.get("/api/terms/" + term + "/").then(function(response) {
                if(!angular.equals(response.data, {})) {
                    $ls.terms[term] = {};
                    angular.merge($ls.courses, processSchedule(response.data, $ls.terms[term]));
                    $ls.selected.course = $ls.terms[term].courses[0];
                } else getCourses();
            }, getCourses);
        else error();
    }
    function getDetails() {
        $http.get("/api/details/").then(function(response) {
            angular.extend($ls.student, response.data);
        }, error);
    }
    if($ls.session) {
        if(!$ls.student) getDetails();
        if(!$ls.terms[term]) getCourses();
    }
    return {
        link: function($scope, element, attrs) {
            $scope.cancel = $mdDialog.cancel;
            $scope.submit = $mdDialog.hide;
            element.on("click", function($event) {
                $mdDialog.show({
                    templateUrl: "/static/login.html",
                    clickOutsideToClose: true,
                    preserveScope: true,
                    targetEvent: $event,
                    parent: body,
                    scope: $scope
                }).then(function(data) {
                    $http.post("/api/login/", data).then(function(response) {
                        $scope.pin = "";
                        $ls.$default({
                            student: response.data,
                            terms: {}, courses: {},
                            emails: { action: "select" },
                            session: { version: version },
                            selected: {
                                term: term,
                                email: [],
                                tab: 0
                            }
                        });
                        $goto("dashboard");
                        getDetails();
                        getCourses();
                    }, function(response) {
                        element.triggerHandler("click");
                    });
                }, error);
            });
        }
    };
}]);
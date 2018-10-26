app.directive("login", ["$mdDialog", "$http", "$ls", "$goto", "$toolbar",

function($mdDialog, $http, $ls, $goto, $toolbar) {
    term = ($ls.student || {}).term || (month > 7 ? year + "10" : year - 1 + (month < 6 ? "20" : "30"));
    if($ls.session) {
        if(!$ls.student.term) getDetails();
        else if(!$ls.terms[term]) getCourses();
    }
    function getCourses(prevFails) {
        var fails = prevFails || 0, thisTerm = term;
        if(fails++ <= 3)
            $http.get("/api/terms/" + thisTerm + "/").then(function(response) {
                if(!angular.equals(response.data, {})) {
                    $ls.terms[thisTerm] = {};
                    angular.merge($ls.courses, processSchedule(response.data, $ls.terms[thisTerm]));
                    $ls.selected.course = $ls.terms[thisTerm].courses[0];
                } else getCourses(fails);
            }, function() { getCourses(fails); });
        else error("Couldn't fetch courses!");
    }
    function getDetails() {
        $http.get("/api/details/").then(function(response) {
            angular.extend($ls.student, response.data);
            if(term !== response.data.term) {
                term = response.data.term;
                $toolbar.thisTerm = term;
                $ls.selected.term = term;
                location.reload();
            }
            getCourses();
        }, error);
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
                    }, function(response) {
                        element.triggerHandler("click");
                    });
                }, error);
            });
        }
    };
}]);
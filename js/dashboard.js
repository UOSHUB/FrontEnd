app.controller("dashboard", ["$scope", "$ls", "$http", "$refresh", "$filter", "$goto", "$toolbar",

function($scope, $ls, $http, $refresh, $filter, $goto, $toolbar) {
    $toolbar.thisTerm = term;

    $scope.mainCards = ["updates", "emails", "deadlines"];
    $scope.subCards = ["finals", "classes", "grades", "holds"];

    $scope.todayClasses = function() {
        var classes = [], day = days[today.getDay()];
        if($ls.terms && $ls.terms[term])
            angular.forEach($ls.terms[term].courses, function(key) {
                var course = $ls.courses[key];
                if(course.days && course.days.indexOf(day) > -1)
                    classes.push(course);
            });
        return classes;
    };

    $scope.dismissUpdate = function(updateId) {
        $http({
            method: "delete",
            url: "/api/updates/" + updateId + "/"
        }).then(nothing, error);
        find($ls.updates, "dismiss", updateId, "delete");
    };

    $scope.goToEmail = function(emailId) {
        $ls.selected.tab = 0;
        $ls.selected.email = ["personal", emailId];
        $goto("email");
    };

    $scope.deleteEmail = function(emailId) {
        $http({
            method: "delete",
            url: "/api/emails/" + emailId + "/"
        }).then(nothing, error);
        $ls.selected.tab = 0;
        $ls.selected.email = [];
        find($ls.emails.personal, "id", emailId, "delete");
    };

    $scope.parseDate = function(date) {
        return new Date(date);
    };

    $scope.beforeDue = function(date) {
        return new Date(date) > today;
    };

    $refresh(["content=deadlines", "emails=personal", "updates", "grades"])
}])

.filter("gradeColor", function() {
    return function(grade) {
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
    };
});
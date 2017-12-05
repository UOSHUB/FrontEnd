app.controller("dashboard", ["$scope", "$ls", "$http", "$refresh", "$filter", "$goto",

function($scope, $ls, $http, $refresh, $filter, $goto) {
    var find = $filter("find");
    if(!$ls.terms[term])
        $http.get("/api/terms/" + term + "/").then(function(response) {
            if(!angular.equals(response.data, {})) {
                $ls.terms[term] = {};
                angular.merge($ls.courses, processSchedule(response.data, $ls.terms[term]));
            }
        }, error);

    if(!$ls.deadlines)
        $http.get("/api/terms/" + term + "/deadlines/").then(function(response) {
            $ls.deadlines = response.data;
        }, error);

    if(!$ls.updates)
        $http.get("/api/updates/").then(function(response) {
            $ls.updates = response.data;
        }, error);

    if(!$ls.emails.personal)
        $http.get("/api/emails/personal/10/").then(function(response) {
            $ls.emails.personal = response.data;
        }, error);

    if(!$ls.holds)
        $http.get("/api/holds/").then(function(response) {
            angular.forEach(response.data, function(hold) {
                hold.start = new Date(hold.start);
                hold.end = new Date(hold.end);
            });
            $ls.holds = response.data;
        }, error);

    if(!$ls.grades)
        $http.get("/api/grades/" + term + "/").then(function(response) {
            $ls.grades = response.data;
        }, error);

    if(!$ls.finals)
        $http.get("/api/finals/" + term + "/").then(function(response) {
            $ls.finals = response.data;
        }, error);

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
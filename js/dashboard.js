app.controller('dashboard', ["$scope", "$ls", "$http",

function($scope, $ls, $http) {
    $scope.term = $ls.selected.term;
    if(!$ls.terms[$scope.term] && ($ls.terms[$scope.term] = {}) || !$ls.terms[$scope.term].settings)
        $http.get("/api/terms/" + $scope.term + "/").then(function(response) {
            angular.merge($ls.terms[$scope.term], processSchedule(response.data));
        }, error);

    ($scope.getDeadlines = function() {
        $http.get("/api/terms/" + $scope.term + "/content/").then(function(response) {
            angular.merge($ls.terms[$scope.term], response.data);
        }, error);
    })();

    ($scope.getUpdates = function() {
        $http.get("/api/updates/").then(function(response) {
            $ls.updates = response.data;
        }, error);
    })();

    ($scope.getEmails = function() {
        $http.get("/api/emails/personal/10/").then(function(response) {
            angular.extend($ls.emails, response.data);
        }, error);
    })();

    ($scope.getHolds = function() {
        $http.get("/api/holds/").then(function(response) {
            angular.forEach(response.data, function(hold) {
                hold.start = new Date(hold.start);
                hold.end = new Date(hold.end);
            });
            $ls.holds = response.data;
        }, error);
    })();

    ($scope.getGrades = function() {
        $http.get("/api/grades/" + $scope.term + "/").then(function(response) {
            angular.merge($ls.terms[$scope.term], response.data);
        }, error);
    })();
}])

.filter('todayClasses', function() {
    return function(courses) {
        var classes = [], day = days[today.getDay()];
        angular.forEach(courses, function(course) {
            if(course.days && course.days.indexOf(day) > -1)
                classes.push(course);
        });
        return classes;
    };
})

.filter('extract', function() {
    return function(courses, items) {
        var list = [];
        angular.forEach(courses, function(course) {
            angular.forEach(course[items], function(item) {
                item.course = course.title;
                list.push(item);
            });
        });
        return list;
    };
})

.filter('gradeColor', function() {
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
app.controller('courses', ["$scope", "$ls", "$http", "$window",

function($scope, $ls, $http, $window) {
    function selectFirstCourse() {
        if(!$ls.selected.course) {
            for(var course in $ls.terms[$ls.selected.term]) break;
            $ls.selected.course = course;
        }
    }

    $scope.getContent = function() {
        $http.get("/api/courses/" + $ls.terms[$ls.selected.term][$ls.selected.course].bb + "/").then(function(response) {
            angular.extend($ls.terms[$ls.selected.term][$ls.selected.course], response.data);
        }, error);
    };

    $scope.getInfo = function() {
        $http.get("/api/courses/" + $ls.selected.course +
                  "/" + $ls.terms[$ls.selected.term][$ls.selected.course].crn +
                  "/" + $ls.selected.term + "/").then(function(response) {
            angular.merge($ls.terms[$ls.selected.term], response.data);
            $scope.course = structureCourse(response.data[$ls.selected.course], $ls.selected.course);
        }, error);
    };

    $scope.$watch(function() { return $ls.selected.course; }, function(id) {
        var course = $ls.terms[$ls.selected.term][id];
        if(course) {
            if(!course.documents)
                $scope.getContent();
            if(!course.section)
                $scope.getInfo();
            else
                $scope.course = structureCourse(course, id);
        }
    });

    if(!$ls.terms[$ls.selected.term] && ($ls.terms[$ls.selected.term] = {}) ||
       !selectFirstCourse() && !$ls.terms[$ls.selected.term][$ls.selected.course].bb)
        $http.get("/api/terms/" + $ls.selected.term + "/courses/").then(function(response) {
            angular.merge($ls.terms[$ls.selected.term], response.data);
            selectFirstCourse();
        }, error);
    else selectFirstCourse();

    ($scope.getUpdates = function() {
        $http.get("/api/updates/").then(function(response) {
            $ls.updates = response.data;
        }, error);
    })();

    $scope.mass = false;
    $scope.all = false;

    $scope.openFile = function(file) {
        $window.open(file, "_blank");
    };
}])

.filter('courseUpdates', function() {
    return function(updates, course) {
        var courseUpdates = [];
        course = parseInt(course);
        angular.forEach(updates, function(update) {
            if(course == update.courseId)
                courseUpdates.push(update);
        });
        return courseUpdates;
    };
});
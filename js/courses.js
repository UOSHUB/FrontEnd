app.controller('courses', ["$scope", "$ls", "$http",

function($scope, $ls, $http) {
    function selectFirstCourse() {
        if(!$ls.selected.course)
            $ls.selected.course = $ls.terms[$ls.selected.term].courses[0];
    }

    if(!$ls.terms[$ls.selected.term] && ($ls.terms[$ls.selected.term] = {}) ||
       !selectFirstCourse() && !$ls.courses[$ls.selected.course].courseId)
        $http.get("/api/terms/" + $ls.selected.term + "/courses/").then(function(response) {
            angular.merge($ls.courses, response.data);
            $ls.terms[$ls.selected.term].courses = Object.keys($ls.courses);
            selectFirstCourse();
        }, error);
    else selectFirstCourse();

    ($scope.getContent = function() {
        $http.get("/api/courses/" + $ls.selected.course + "/" +
                  $ls.courses[$ls.selected.course].courseId + "/").then(function(response) {
            angular.merge($ls, {documents: [], deadlines: []});
            $ls.documents = $ls.documents.concat(response.data.documents);
            $ls.deadlines = $ls.deadlines.concat(response.data.deadlines);
        }, error);
    })();

    ($scope.getInfo = function() {
        $http.get("/api/courses/" + $ls.selected.course +
                      "/" + $ls.courses[$ls.selected.course].crn +
                      "/" + $ls.selected.term + "/"
                 ).then(function(response) {
            angular.merge($ls.courses, response.data);
            $scope.course = structureCourse($ls.courses[$ls.selected.course], $ls.selected.course);
        }, error);
    })();

    $scope.$watch(function() { return $ls.selected.course; }, function(id) {
        var course = $ls.courses[id];
        if(course)
            if(!course.section)
                $scope.getInfo();
            else
                $scope.course = structureCourse(course, id);
    });

    ($scope.getUpdates = function() {
        $http.get("/api/updates/").then(function(response) {
            $ls.updates = response.data;
        }, error);
    })();

    $scope.mass = false;
    $scope.all = false;

    $scope.openFile = function(doc) {
        var link = angular.element("<a href='" + doc.url + "' name='" + doc.file + "' target='_blank'></a>");
        body.append(link);
        link[0].click();
        link.remove();
    };

    $scope.downloadFiles = function() {
        angular.forEach($(".download"), function(file) {
            if(file.querySelector("md-checkbox").classList.contains("md-checked"))
                file.querySelector("a").click();
        });
    };
}])

.filter('inCourse', function() {
    return function(items, course) {
        var inCourse = [];
        angular.forEach(items, function(item) {
            if(course == item.course)
                inCourse.push(item);
        });
        return inCourse;
    };
});
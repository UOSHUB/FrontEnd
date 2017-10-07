app.controller('courses', ["$scope", "$ls", "$http",

function($scope, $ls, $http) {
    function selectFirstCourse() {
        if(!$ls.selected.course) {
            for(var course in $ls.terms[$ls.selected.term]) break;
            $ls.selected.course = course;
        }
    }

    $scope.getContent = function() {
        $http.get("/api/courses/" + $ls.terms[$ls.selected.term][$ls.selected.course].bb).then(function(response) {
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
            $scope.getContent();
        }, error);
    else selectFirstCourse();

    $scope.repeat = new Array(12);
    $scope.mass = false;
    $scope.all = false;
    $scope.announcements = [{
        title: 'There Will Be No Classes Next Week!',
        time: '13 hours ago'
    }, {
        title: 'Chapter 6 is Now Available',
        time: '2 days ago'
    }, {
        title: 'Be Prepared For a Quiz Tomorrow',
        time: '3 days ago'
    }];

    $scope.tasks = [{
        title: 'Project Final Submission Due',
        group: 'By Course',
        day: 'Today',
        time: '11:59 AM'
    }, {
        title: 'Study Chapter 5',
        group: 'My Task',
        day: 'Tomorrow',
        time: '1:59 AM'
    }, {
        title: 'Final Exam',
        group: 'By Course',
        day: 'In Two days',
        time: '5:59 AM'
    }];
}]);
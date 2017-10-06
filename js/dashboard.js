app.controller('dashboard', ["$scope", "$ls", "$http",

function($scope, $ls, $http) {
    $scope.term = currentTerm();
    if(!$ls.terms[$scope.term] && ($ls.terms[$scope.term] = {}) || !$ls.terms[$scope.term].settings)
        $http.get("/api/terms/" + $scope.term).then(function(response) {
            angular.extend($ls.terms[$scope.term], processSchedule(response.data));
        }, error);

    ($scope.getDeadlines = function() {
        $http.get("/api/terms/" + $scope.term + "/content/").then(function(response) {
            angular.extend($ls.terms[$scope.term], response.data);
        }, error);
    })();

    ($scope.getUpdates = function() {
        $http.get("/api/updates/").then(function(response) {
            $ls.updates = response.data;
        }, error);
    })();

    ($scope.getEmails = function() {
        $http.get("/api/emails/previews").then(function(response) {
            $ls.emails = response.data;
        }, error);
    })();

    $scope.getInitials = function(name) {
        if(!name) return;
        var words = name.split(' ');
        return (
            words[1] ?
            words[0].slice(0, 1) + words[1].slice(0, 1):
            words[0].slice(0, 2)
        ).toUpperCase();
    };

    $scope.grades = [{
        course: 'Networking Fundamentals',
        letter: 'A',
        color: 'green'
    }, {
        course: 'Multimedia Programming & Design',
        letter: 'B',
        color: 'lime'
    }, {
        course: 'Principles of Marketing',
        letter: 'C',
        color: 'orange'
    }, {
        course: 'Statistics for Science',
        letter: 'D',
        color: 'red'
    }];
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

.filter('deadlines', function() {
    return function(courses) {
        var deadlines = [];
        angular.forEach(courses, function(course) {
            angular.forEach(course.deadlines, function(deadline) {
                deadline.course = course.title;
                deadlines.push(deadline);
            });
        });
        return deadlines;
    };
});
app.controller('dashboard', ["$scope", "$ls", "$http",

function($scope, $ls, $http) {
    $scope.term = currentTerm();
    if(!$ls.terms[$scope.term] && ($ls.terms[$scope.term] = {}) || !$ls.terms[$scope.term].settings)
        $http.get("/api/terms/" + $scope.term).then(function(response) {
            angular.extend($ls.terms[$scope.term], processSchedule(response.data));
        }, error);

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

    $scope.repeat = [0,1,2,3,4,5,6,7,8,9];

    $scope.tasks = [{
        title: 'Project Final Submission Due',
        group: 'Introduction to Computer Graphics',
        day: 'Today',
        time: '11:59 AM'
    }, {
        title: 'Chapter 6 Available',
        group: 'Critical Reading and Writing',
        day: 'Tomorrow',
        time: '1:59 AM'
    }, {
        title: 'Notes - 3dsmax Available',
        group: '2D/3D Computer Animation',
        day: 'In Two days',
        time: '5:59 AM'
    }];

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
});
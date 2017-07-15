app.controller('Courses', function($scope, $localStorage) {
    for (var firstCourseId in $localStorage.semesters[$localStorage.semester]) break;
    $localStorage.course = firstCourseId;
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
});
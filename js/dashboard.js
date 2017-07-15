app.controller('Dashboard', function($scope, $localStorage) {
    $scope.repeat = [0,1,2,3,4,5,6,7,8,9];
    $scope.announcements = [{
        title: 'Project Final Submission Due',
        course: 'Introduction to Computer Graphics',
        time: '13 hours ago'
    }, {
        title: 'Chapter 6 Available',
        course: 'Critical Reading and Writing',
        time: '2 days ago'
    }, {
        title: 'Notes - 3dsmax Available',
        course: '2D/3D Computer Animation',
        time: '3 days ago'
    }];

    $scope.emails = [{
        subject: 'Project Final Submission Due',
        sender: 'Introduction to Computer Graphics',
        time: '13 hours ago'
    }, {
        subject: 'Chapter 6 Available',
        sender: 'Critical Reading and Writing',
        time: '2 days ago'
    }, {
        subject: 'Notes - 3dsmax Available',
        sender: '2D/3D Computer Animation',
        time: '3 days ago'
    }];
    $scope.getInitials = function(name) {
        var words = name.split(' ');
        return (words[0].slice(0, 1) + words[1].slice(0, 1)).toUpperCase();
    };

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

    $scope.classes = {
        "1412340": $localStorage.semesters[1]["1412340"],
        "1412444": $localStorage.semesters[1]["1412444"]
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
});
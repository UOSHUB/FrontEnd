app.controller('Email', function($scope) {
    $scope.filter = 0;
    $scope.repeat = new Array(15);
    $scope.content = [{
        initial: 'D',
        title: 'Personal Email #',
        sender: function(index) { return 'Doctor Name #' + index + ' <doctor' + index + '@sharjah.ac.ae>'; },
        time: ' Days Ago'
    }, {
        initial: 'C',
        title: 'Course Announcement #',
        sender: function(index) { return 'Course Name #' + index; },
        time: ' Hours Ago'
    }, {
        initial: 'S',
        title: 'New Announcement #',
        sender: function(index) { return 'Sender Name #' + index + ' <doctor' + index + '@sharjah.ac.ae>'; },
        time: ' Minutes Ago'
    }];
    ($scope.openEmail = function(index) {
        $scope.current = $scope.content[$scope.filter];
        $scope.current.index = index + 1;
    })(0);
});
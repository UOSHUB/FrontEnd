app.controller('dashboard', ["$scope", "$ls", "$http",

function($scope, $ls, $http) {
    ($scope.getUpdates = function() {
        $http.get("/api/updates/").then(function(response) {
            angular.forEach(response.data.updates, function(item) {
                item.course = response.data.courses[item.courseId].split('-')[0];
            });
            angular.extend($ls, {updates: response.data.updates});
        }, function() {});
    })();

    ($scope.getEmails = function() {
        $http.get("/api/emails/previews").then(function(response) {
            $ls.emails = response.data;
        }, function() {});
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

    $scope.classes = {
        "1412340": $ls.semesters[1]["1412340"],
        "1412444": $ls.semesters[1]["1412444"]
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
}]);
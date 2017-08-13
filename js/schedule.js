app.controller('schedule', ["$scope", "$mdDialog", "$ls", "$http",

function($scope, $mdDialog, $ls, $http) {
    ($scope.getTerm = function(term) {
        if(!$ls.terms[term])
            $http.get('/api/schedule/' + term).then(function(response) {
                $ls.terms[term] = response.data;
                $ls.term = term;
            }, function() {});
    })($ls.term || currentTerm());

    $ls.semestersTitles = [
        "Spring Semester 2016 - 2017",
        "Fall Semester 2016 - 2017",
        "Spring Semester 2015 - 2016",
        "Fall Semester 2015 - 2016"
    ];
    if($ls.semester == -1)
        $ls.semester = 1;
    $scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu"];
    $scope.height = 14.074074074074074;
    $scope.labels = [[8,"AM"],[9,"AM"],[10,"AM"],[11,"AM"],[12,"PM"],[1,"PM"],[2,"PM"]];
    $scope.fractions = [0.5,1.5,2.5,3.5,4.5,5.5,6.5];
    $scope.dates = ["5/7","5/8","5/9","5/10","5/11"];

    $scope.cancel = $mdDialog.cancel;
    $scope.showCourse = function(event, id, x) {
        $scope.course = $ls.semesters[$ls.semester][id];
        $scope.course.id = id;
        $mdDialog.show({
            templateUrl: 'class-dialog',
            parent: $('body'),
            clickOutsideToClose: true,
            preserveScope: true,
            targetEvent: event,
            scope: $scope
        });
    };
}]);
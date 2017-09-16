app.controller('schedule', ["$scope", "$toolbar", "$ls", "$http", "$mdDialog",

function($scope, $toolbar, $ls, $http, $mdDialog) {
    function terms(term) {
        if($ls.terms)
            return true;
        $ls.terms = {};
        if(term) $ls.selected.term = term;
        return false;
    }

    ($toolbar.getSchedule = function(term) {
        if(!terms(term) || !angular.isObject($ls.terms[term])) {
            $scope.loading = true;
            $http.get('/api/schedule/' + term).then(function(response) {
                $ls.terms[term] = processSchedule(response.data);
                $scope.loading = false;
            }, function() {});
        }
    })($ls.selected.term || currentTerm());

    $toolbar.getTerms = function() {
        if(!terms() || Object.keys($ls.terms).length == 1)
            $http.get('/api/schedule/').then(function(response) {
                $ls.terms = angular.extend(response.data, $ls.terms);
            }, function() {});
    };

    $ls.semestersTitles = [
        "Spring Semester 2016 - 2017",
        "Fall Semester 2016 - 2017",
        "Spring Semester 2015 - 2016",
        "Fall Semester 2015 - 2016"
    ];
    if($ls.selected.semester == -1)
        $ls.selected.semester = 1;
    $scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu"];
    $scope.height = 14.074074074074074;
    $scope.labels = [[8,"AM"],[9,"AM"],[10,"AM"],[11,"AM"],[12,"PM"],[1,"PM"],[2,"PM"]];
    $scope.fractions = [0.5,1.5,2.5,3.5,4.5,5.5,6.5];
    $scope.dates = ["5/7","5/8","5/9","5/10","5/11"];

    $scope.cancel = $mdDialog.cancel;
    $scope.showCourse = function(event, id) {
        $scope.course = structureCourse($ls.terms[$ls.selected.term][id], id);
        $mdDialog.show({
            templateUrl: 'class-dialog',
            parent: $('body'),
            clickOutsideToClose: true,
            preserveScope: true,
            targetEvent: event,
            scope: $scope
        });
    };
}])

.filter('termTitle', function() {
    return function(termCode) {
        var year = termCode.slice(0, 4);
        return {"10": "Fall", "20": "Spring", "30": "Summer"}[termCode.slice(4)]
               + " Semester " + year + " - " + (Number(year) + 1);
    };
})

.filter('orderTerms', function() {
    return function(terms) {
        return Object.keys(terms).reverse();
    };
});
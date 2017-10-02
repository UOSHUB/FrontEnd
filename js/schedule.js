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
            }, error);
        } else $ls.selected.term = term;
    })($ls.selected.term || currentTerm());

    $toolbar.getTerms = function() {
        if(!terms() || Object.keys($ls.terms).length == 1)
            $http.get('/api/schedule/').then(function(response) {
                $ls.terms = angular.extend(response.data, $ls.terms);
            }, error);
    };

    $scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu"];
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
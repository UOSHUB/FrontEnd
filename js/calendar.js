app.controller('calendar', ["$scope", "$filter",

function($scope, $filter) {
    $scope.selectedDate = new Date();
    $scope.firstDayOfWeek = 6; // First day of the week, 0 for Sunday, 1 for Monday, etc.
    $scope.tooltips = true;

    $scope.events = {
        '13 7': 'IELTS Exam',
        '17 7': 'TOEFL Exam',
        '18 7': 'Classes end',
        '20 7': 'Final Examinations',
        '21 7': 'Final Examinations',
        '22 7': 'Final Examinations',
        '23 7': 'Final Examinations',
        '24 7': 'Final Examinations',
        '25 7': 'Final Examinations',
        '26 7': 'Final Examinations',
        '27 7': 'Final Examinations',
        '28 7': 'Final Examinations',
        '29 7': 'Final Examinations',
        '30 7': 'Final Examinations',
        '31 7': 'Final Examinations'
    };

    $scope.setDayContent = function(date) {
        var event = $scope.events[date.getDate() + ' ' + date.getMonth()];
        if(event)
            return "<div class='breadcrumb'>" + event + "</div>";
    };
}]);
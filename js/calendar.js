app.controller('calendar', function($scope, $filter) {
    $scope.selectedDate = new Date();
    $scope.firstDayOfWeek = 6; // First day of the week, 0 for Sunday, 1 for Monday, etc.
    $scope.tooltips = true;

    $scope.events = {
        '13 4': 'IELTS Exam',
        '17 4': 'TOEFL Exam',
        '18 4': 'Classes end',
        '20 4': 'Final Examinations',
        '21 4': 'Final Examinations',
        '22 4': 'Final Examinations',
        '23 4': 'Final Examinations',
        '24 4': 'Final Examinations',
        '25 4': 'Final Examinations',
        '26 4': 'Final Examinations',
        '27 4': 'Final Examinations',
        '28 4': 'Final Examinations',
        '29 4': 'Final Examinations',
        '30 4': 'Final Examinations',
        '31 4': 'Final Examinations'
    };

    $scope.setDayContent = function(date) {
        var event = $scope.events[date.getDate() + ' ' + date.getMonth()]
        if(event)
            return "<div class='breadcrumb'>" + event + "</div>";
    };
});
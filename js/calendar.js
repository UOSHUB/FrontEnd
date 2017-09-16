app.controller('calendar', ["$scope",

function($scope) {
    $scope.selectedDate = new Date();
    $scope.firstDayOfWeek = 6; // First day of the week, 0 for Sunday, 1 for Monday, etc.
    $scope.tooltips = true;

    $scope.events = {
        '13 8': 'IELTS Exam',
        '17 8': 'TOEFL Exam',
        '18 8': 'Classes end',
        '20 8': 'Final Examinations',
        '21 8': 'Final Examinations',
        '22 8': 'Final Examinations',
        '23 8': 'Final Examinations',
        '24 8': 'Final Examinations',
        '25 8': 'Final Examinations',
        '26 8': 'Final Examinations',
        '27 8': 'Final Examinations',
        '28 8': 'Final Examinations',
        '29 8': 'Final Examinations',
        '30 8': 'Final Examinations',
        '31 8': 'Final Examinations'
    };

    $scope.setDayContent = function(date) {
        var event = $scope.events[date.getDate() + ' ' + date.getMonth()];
        if(event) return "<div class='breadcrumb'>" + event + "</div>";
    };
}]);
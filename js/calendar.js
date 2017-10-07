app.controller('calendar', ["$scope", "$ls", "$http",

function($scope, $ls, $http) {
    $scope.selectedDate = new Date();
    $scope.firstDayOfWeek = 6; // First day of the week, 0 for Sunday, 1 for Monday, etc.
    $scope.tooltips = true;

    function parseEvents() {
        $scope.events = [];
        var date, year = " " + today.getFullYear();
        angular.forEach($ls.events, function(event) {
            date = event.date.split(" - ");
            if(date.length > 1) {
                if(date[0].split(" ").length == 1)
                    date[0] += " " + date[1].split(" ")[1];
                date = [new Date(date[0] + year), new Date(date[1] + year)];
            } else
                date = new Date(date[0] + year);
            $scope.events.push({
                text: event.text,
                date: date
            });
        });
    }

    if(!$ls.events)
        $http.get("/api/calendar/" + $ls.selected.term + "/").then(function(response) {
            $ls.events = response.data;
            parseEvents();
        }, error);
    else parseEvents();

    $scope.setDayContent = function(date) {
        for(var event, i = 0; i < $scope.events.length; i++) {
            event = $scope.events[i].date;
            if(!event.length) {
                if(event.getDate() == date.getDate() && event.getMonth() == date.getMonth())
                    return "<div class='breadcrumb'>" + $scope.events[i].text + "</div>";
            } else if(event[0] < date && date < event[1])
                    return "<div class='breadcrumb'>" + $scope.events[i].text + "</div>";
        }
    };
}]);
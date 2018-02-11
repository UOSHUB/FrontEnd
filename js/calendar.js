app.controller("calendar", ["$scope", "$ls", "$http", "MaterialCalendarData",

function($scope, $ls, $http, $calendar) {
    angular.extend($scope, {
        selectedDate: new Date(),
        firstDayOfWeek: 6, // First day of the week, 0 for Sunday, 1 for Monday, etc.
        tooltips: true,
        events: []
    });

    function parseEvents() {
        var date, yearString = " " + year;
        angular.forEach($ls.events, function(event) {
            date = event.date.split(" - ");
            if(date.length > 1) {
                if(date[0].split(" ").length == 1)
                    date[0] += " " + date[1].split(" ")[1];
                date = [new Date(date[0] + yearString), new Date(date[1] + yearString)];
            } else
                date = new Date(date[0] + yearString);
            $scope.events.push({
                text: event.text,
                date: date
            });
        });
    }

    if(!$ls.events)
        $http.get("/api/calendar/" + term + "/").then(function(response) {
            $ls.events = response.data;
            parseEvents();
            var start = new Date(year, month - 2, 24), end = new Date(year, month, 6);
            for(var date = start; date <= end; date.setDate(date.getDate() + 1))
                $calendar.setDayContent(date, $scope.setDayContent(date));
        }, error);
    else parseEvents();

    $scope.setDayContent = function(date) {
        for(var event, i = 0; i < $scope.events.length; i++) {
            event = $scope.events[i].date;
            if(!event.length) {
                if(event.getDate() == date.getDate() && event.getMonth() == date.getMonth())
                    return "<div class='breadcrumb'>" + $scope.events[i].text + "</div>";
            } else if(event[0] <= date && date <= event[1])
                    return "<div class='breadcrumb'>" + $scope.events[i].text + "</div>";
        }
    };
}]);
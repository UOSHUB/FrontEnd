app.controller("reports", ["$scope", function($scope) {
    $scope.reports = [
        {
            "Unofficial Transcript": {
                icon: "tasks",
                desc: "What you took and what you're taking right now"
            },
            "Summarized Schedule": {
                icon: "calendar",
                desc: "Table of this term's schedule (Reveals Advisor!)"
            },
            "Personal Information": {
                icon: "id-card",
                desc: "Your details as they're going to be in your degree"
            }
        }, {
            "Study Plan": {
                icon: "map",
                desc: "List of courses you need to take to get your degree"
            },
            "Final Exams": {
                icon: "pencil",
                desc: "Contains the date and location of your final exams"
            },
            "Offered Courses": {
                icon: "list-ul",
                desc: "Huge list of all courses offered this semester"
            }
        }
    ];
}]);
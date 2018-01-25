app.controller("dashboard", ["$scope", "$refresh", "$toolbar", function($scope, $refresh, $toolbar) {
    $toolbar.thisTerm = term;

    $scope.mainCards = ["updates", "emails", "deadlines"];
    $scope.subCards = ["finals", "classes", "grades", "holds"];

    $refresh(["content=deadlines", "emails=personal", "updates", "grades"])
}])

.filter("gradeColor", function() {
    return function(grade) {
        var percent = grade.grade / grade.outOf * 100;
        if(percent < 60)
            return "red";
        if(percent < 70)
            return "orange";
        if(percent < 80)
            return "yellow";
        if(percent < 90)
            return "lime";
        return "green";
    };
});
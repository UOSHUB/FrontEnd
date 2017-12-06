app.controller("courses", ["$scope", "$ls", "$http", "$refresh", "$toolbar", "$toast", "$mdDialog",

function($scope, $ls, $http, $refresh, $toolbar, $toast, $mdDialog) {
    $toolbar.term = term;
    if(!$ls.terms[term])
        $http.get("/api/terms/" + term + "/").then(function(response) {
            if(!angular.equals(response.data, {})) {
                $ls.terms[term] = {};
                angular.merge($ls.courses, processSchedule(response.data, $ls.terms[term]));
                $ls.selected.course = $ls.terms[term].courses[0];
            }
        }, error);
    else if(!$ls.selected.course)
        $ls.selected.course = $ls.terms[term].courses[0];

    if(!$ls.deadlines)
        $http.get("/api/terms/" + term + "/content/").then(function(response) {
            angular.extend($ls, response.data);
        }, error);
    else if(!$ls.documents)
        $http.get("/api/terms/" + term + "/documents/").then(function(response) {
            $ls.documents = response.data;
        }, error);

    if(!$ls.updates)
        $http.get("/api/updates/").then(function(response) {
            $ls.updates = response.data;
        }, error);

    $scope.$watch(function() { return $ls.selected.course; }, function(id) {
        if($ls.courses[id])
            $scope.course = structureCourse($ls.courses[id], id);
    });

    $scope.mass = false;
    $scope.all = false;

    $scope.openFile = function(doc) {
        var link = angular.element("<a href='" + doc.url + "' name='" + doc.file + "' target='_blank'></a>");
        body.append(link);
        link[0].click();
        link.remove();
    };

    $scope.downloadFiles = function() {
        angular.forEach($(".download"), function(file) {
            if(file.querySelector("md-checkbox").classList.contains("md-checked"))
                file.querySelector("a").click();
        });
    };

    $scope.sendEmail = function($event, subject, body, course) {
        $mdDialog.show(
            $mdDialog.confirm()
                .title("Subject: " + subject)
                .textContent("To: " + $ls.courses[course].doctor)
                .targetEvent($event)
                .clickOutsideToClose(true)
                .ok("Send it")
                .cancel("Cancel")
        ).then(function() {
            $http.post("/api/emails/send/", {
                subject: subject,
                body: body,
                recipients: $ls.courses[course].email
            }).then(function() {
                $toast("Your emails has been sent");
            }, function() {
                $toast("Failed to send email!");
            });
        }, nothing);
    };

    $refresh(["content", "updates"])
}])

.filter("inCourse", function() {
    return function(items, course) {
        var inCourse = [];
        angular.forEach(items, function(item) {
            if(course == item.course)
                inCourse.push(item);
        });
        return inCourse;
    };
});
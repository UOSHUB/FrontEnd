app.controller("emails", ["$scope", "$ls", "$http", "$refresh", "$toast", "$emailsLoader",

function($scope, $ls, $http, $refresh, $toast, $emailsLoader) {
    /*if(!$ls.emails.body)
        $ls.emails.body = {};

    $scope.getInitials = getInitials;
    $scope.tabs = ["personal", "courses", "events"];
    $scope.icons = {personal: "users", courses: "book", events: "bullhorn"};
    $scope.emailsLoaders = {
        personal: $emailsLoader("personal"),
        courses: $emailsLoader("courses"),
        events: $emailsLoader("events")
    };

    ($scope.openEmail = function(tab, id) {
        if(tab && id) {
            $ls.selected.email = [tab, id];
            if(!$ls.emails.body[id])
                $http.get("/api/emails/" + id + "/").then(function(response) {
                    $ls.emails.body[id] = response.data;
                }, error);
        } else if($ls.emails.personal)
            $scope.openEmail("personal", $ls.emails.personal[0].id);
    })($ls.selected.email[0], $ls.selected.email[1]);

    $scope.isSelected = function(tab, id) {
        return $ls.selected.email[0] == tab && $ls.selected.email[1] == id;
    };

    $scope.sendEmail = function($event, to, subject, body) {
        $http.post("/api/emails/send/", {
            recipients: to,
            subject: subject,
            body: body
        }).then(function() {
            $ls.emails.action = "select";
            $toast("Your emails has been sent");
        }, function() {
            $toast("Failed to send email!");
        });
    };

    $refresh(["emails"])*/
}]);
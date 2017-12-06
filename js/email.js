app.controller("email", ["$scope", "$ls", "$http", "$refresh", "$toast", "$mdDialog",

function($scope, $ls, $http, $refresh, $toast, $mdDialog) {
    if(!$ls.emails.body)
        $ls.emails.body = {};

    $ls.writingEmail = false;
    $scope.tabs = ["personal", "courses", "events"];
    $scope.icons = {personal: "users", courses: "book", events: "bullhorn"};

    ($scope.getEmails = function(category) {
        if(!$ls.emails[category] || $ls.emails[category].length < 20)
            $http.get("/api/emails/" + category + "/").then(function(response) {
                $ls.emails[category] = response.data;
                if($ls.selected.email.length == 0)
                    $scope.openEmail("personal", response.data[0].id);
            }, error);
    })($scope.tabs[$ls.selected.tab]);

    ($scope.openEmail = function(tab, id) {
        if(tab && id) {
            $ls.writingEmail = false;
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
            $ls.writingEmail = false;
            $toast("Your emails has been sent");
        }, function() {
            $toast("Failed to send email!");
        });
    };

    $refresh(["emails"])
}]);
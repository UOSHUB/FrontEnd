app.controller("layout", ["$scope", "$ls", "$toolbar", "$goto", "$http", "$mdSidenav", "$mdMedia", "$mdDialog", "$toast", "$location",

function($scope, $ls, $toolbar, $goto, $http, $mdSidenav, $mdMedia, $mdDialog, $toast, $location) {
    $location.search({});
    $scope.$on("$routeChangeStart", function(event, next) {
        if(next.$$route && next.$$route.controller == "welcome" && $ls.session)
            $goto("dashboard");
    });
    $scope.$on("$routeChangeSuccess", function(event, current) {
        $scope.currentPage = current.$$route ? current.$$route.controller : null;
        $scope.hasToolbar = Object.keys($scope.pages).indexOf($scope.currentPage) > -1;
    });
    angular.extend($scope, {
        $toolbar: $toolbar,
        $media: $mdMedia,
        goto: $goto,
        $ls: $ls
    });
    $scope.pages = {
        dashboard: "tachometer",
        schedule: "calendar",
        courses: "book",
        emails: "envelope",
        reports: "file",
        calendar: "globe"
    };
    $scope.toggleSidenav = function(burgerButton) {
        if(!$mdMedia("gt-sm"))
            $mdSidenav("sidenav").toggle();
        else if(burgerButton)
            $ls.selected.tightNav = !$ls.selected.tightNav;
    };

    $scope.sendFeedback = function(event) {
        $mdDialog.show(
            $mdDialog.prompt()
                .title("Share your feedback, suggestion or idea :)")
                .placeholder("Your website is, has, needs...")
                .clickOutsideToClose(true)
                .targetEvent(event)
                .cancel("cancel")
                .ok("Send")
        ).then(function(feedback) {
            $http.post("/api/emails/send/", {
                recipients: "uoshub@gmail.com",
                subject: "Feedback from " + $ls.student.name,
                body: feedback
            }).then(function() {
                $toast("Thank you for your feedback ^_^");
            }, function() {
                $toast("Failed to send your feedback!");
            });
        }, nothing);
    };
}]);
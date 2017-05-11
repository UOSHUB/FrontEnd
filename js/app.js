angular.module('UOSHUB', ['ngMaterial', 'ngRoute', 'materialCalendar'])

.config(function($locationProvider, $compileProvider, $mdAriaProvider, $mdThemingProvider, $mdIconProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $compileProvider.debugInfoEnabled(false);
    $mdAriaProvider.disableWarnings();
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue-grey');
    $mdIconProvider
        .icon("logo", "/static/img/logo.svg")
        .icon("md-tabs-arrow", "/static/img/tabs-arrow-icon.svg");
    $routeProvider.when('/', {
        templateUrl: filePath()
    }).when('/Dashboard', {
        templateUrl: filePath('dashboard')
    }).when('/Schedule', {
        templateUrl: filePath('schedule'),
        controller: 'Schedule'
    }).when('/Courses', {
        templateUrl: filePath('courses')
    }).when('/Email', {
        templateUrl: filePath('email')
    }).when('/Calendar', {
        templateUrl: filePath('calendar'),
        controller: 'Calendar'
    });
})

.run(function($location, $rootScope) {
    $rootScope.redirect = function(link) {
        $location.path(link);
    };
})

.controller('Sidenav', function($scope, $rootScope) {
    $rootScope.$on('login', function(event) {
        $scope.links = [{
            title: 'Dashboard',
            icon: 'tachometer'
        },{
            title: 'Schedule',
            icon: 'calendar'
        },{
            title: 'Courses',
            icon: 'book'
        },{
            title: 'Email',
            icon: 'envelope'
        },{
            title: 'Calendar',
            icon: 'globe'
        }];
    });
})

.controller('Toolbar', function($scope, $mdDialog, $rootScope) {
    $rootScope.status = 'logged-out';
    $scope.cancel = $mdDialog.cancel;
    $scope.hide = $mdDialog.hide;
    $scope.login = function(event) {
        $mdDialog.show({
            templateUrl: 'login-dialog',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            preserveScope: true,
            targetEvent: event,
            scope: $scope
        }).then(function() {
            $rootScope.$emit('login');
            $rootScope.status = 'logged-in';
            $rootScope.redirect('Dashboard');
        }, function(){});
    };
})

.controller('Schedule', function($scope, $mdDialog) {
    $scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu"];
    $scope.courses = {"1411341":{"ch":3,"crn":10889,"days":["M","W"],"doctor":["Manar Abu Talib","Mtalib@sharjah.ac.ae"],"name":"Web Programming","place":["W8","106"],"section":"11","time":["12:30 PM","1:45 PM"],"color":"red","minutes":[750,825],"points":[[24,75.37037037037038],[62,75.37037037037038]],"length":1.25},"1411440":{"ch":3,"crn":10893,"days":["M","W"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Introduction to Computer Graphics","place":["W8","005"],"section":"11","time":["8:00 AM","9:15 AM"],"color":"teal","minutes":[480,555],"points":[[24,12.037037037037038],[62,12.037037037037038]],"length":1.25},"1412340":{"ch":3,"crn":10899,"days":["T","R"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"2D/3D Computer Animation","place":["W8","105"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"green","minutes":[570,645],"points":[[43,33.14814814814815],[81,33.14814814814815]],"length":1.25},"1412444":{"ch":3,"crn":10900,"days":["T","R"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Game Design & Development","place":["W8","106"],"section":"11","time":["11:00 AM","12:15 PM"],"color":"orange","minutes":[660,735],"points":[[43,54.25925925925926],[81,54.25925925925926]],"length":1.25},"0202227":{"ch":3,"crn":10214,"days":["M","W"],"doctor":["Muhieddin AlQaddour","malqaddour@sharjah.ac.ae"],"name":"Critical Reading and Writing","place":["M10","101"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"purple","minutes":[570,645],"points":[[24,33.14814814814815],[62,33.14814814814815]],"length":1.25}};
    $scope.height = 14.074074074074074;
    $scope.labels = [[8,"AM"],[9,"AM"],[10,"AM"],[11,"AM"],[12,"PM"],[1,"PM"],[2,"PM"]];
    $scope.fractions = [0.5,1.5,2.5,3.5,4.5,5.5,6.5];
    $scope.dates = ["5/7","5/8","5/9","5/10","5/11"];

    $scope.cancel = $mdDialog.cancel;
    $scope.showClass = function(event, id, x) {
        $scope.class = $scope.courses[id];
        $scope.class.id = id;
        $mdDialog.show({
            templateUrl: 'class-dialog',
            parent: angular.element(document.body),
            clickOutsideToClose: true,
            preserveScope: true,
            targetEvent: event,
            scope: $scope
        });
    };
})

.controller("Calendar", function($scope, $filter) {
    $scope.dayFormat = "d";
    $scope.selectedDate = new Date();
    $scope.firstDayOfWeek = 6; // First day of the week, 0 for Sunday, 1 for Monday, etc.
    $scope.tooltips = true;

    $scope.setDirection = function(direction) {
      $scope.direction = direction;
      $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };

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

function filePath(url) {
    return '/static/' + (url || 'index') + '.html';
}
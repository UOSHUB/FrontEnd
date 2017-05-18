angular.module('UOSHUB', ['ngMaterial', 'ngRoute', 'ngStorage', 'materialCalendar'])

.config(function($locationProvider, $compileProvider, $mdAriaProvider, $mdThemingProvider,
                 $mdIconProvider, $routeProvider, $localStorageProvider) {
    $locationProvider.html5Mode(true);
    $compileProvider.debugInfoEnabled(false);
    $mdAriaProvider.disableWarnings();
    $localStorageProvider.setKeyPrefix('');
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue-grey')
        .warnPalette('blue');
    $mdIconProvider
        .icon("logo", "img/logo.svg")
        .icon("md-tabs-arrow", "img/tabs-arrow-icon.svg");
    $routeProvider.when('/', {
        templateUrl: filePath(),
        controller: 'Index'
    }).when('/Dashboard', {
        templateUrl: filePath('dashboard'),
        controller: 'Dashboard'
    }).when('/Schedule', {
        templateUrl: filePath('schedule'),
        controller: 'Schedule'
    }).when('/Courses', {
        templateUrl: filePath('courses'),
        controller: 'Courses'
    }).when('/Email', {
        templateUrl: filePath('email'),
        controller: 'Email'
    }).when('/Calendar', {
        templateUrl: filePath('calendar'),
        controller: 'Calendar'
    });
})

.run(function($location, $rootScope, $localStorage) {
    $rootScope.$loc = $location;
    $rootScope.redirect = function(link) {
        $location.path(link);
    };
    $rootScope.$ls = $localStorage.$default({
        semesters: [
            {"1411445":{"ch":3,"crn":21155,"days":["T","R"],"doctor":["Djedjiga Mouheb","dmouheb@sharjah.ac.ae"],"name":"IT Application in E-Commerce","place":["W8","105"],"section":"11","time":["8:00 AM","9:15 AM"],"color":"red","minutes":[480,555],"points":[[43,12.037037037037038],[81,12.037037037037038]],"length":1.25},"1411490":{"ch":3,"crn":21167,"days":["T","R"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Topics in Computer Science I","place":["W8","105"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"teal","minutes":[570,645],"points":[[43,33.14814814814815],[81,33.14814814814815]],"length":1.25},"1412341":{"ch":3,"crn":21163,"days":["M","W"],"doctor":["Imran N. Junejo","ijunejo@sharjah.ac.ae"],"name":"3D Design for Web","place":["W8","106"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"green","minutes":[570,645],"points":[[24,33.14814814814815],[62,33.14814814814815]],"length":1.25},"1412443":{"ch":3,"crn":21168,"days":["M","W"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Human-Computer Interaction","place":["W9","005"],"section":"11","time":["12:30 PM","1:45 PM"],"color":"orange","minutes":[750,825],"points":[[24,75.37037037037038],[62,75.37037037037038]],"length":1.25},"0602246":{"ch":3,"crn":20935,"days":["M","W"],"doctor":["Wael A. Allam","wallam@sharjah.ac.ae"],"name":"Human Rights in Islam & International Declaration","place":["M1","023"],"section":"02A","time":["11:00 AM","12:15 PM"],"color":"purple","minutes":[660,735],"points":[[24,54.25925925925926],[62,54.25925925925926]],"length":1.25}},
            {"1411341":{"ch":3,"crn":10889,"days":["M","W"],"doctor":["Manar Abu Talib","Mtalib@sharjah.ac.ae"],"name":"Web Programming","place":["W8","106"],"section":"11","time":["12:30 PM","1:45 PM"],"color":"red","minutes":[750,825],"points":[[24,75.37037037037038],[62,75.37037037037038]],"length":1.25},"1411440":{"ch":3,"crn":10893,"days":["M","W"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Introduction to Computer Graphics","place":["W8","005"],"section":"11","time":["8:00 AM","9:15 AM"],"color":"teal","minutes":[480,555],"points":[[24,12.037037037037038],[62,12.037037037037038]],"length":1.25},"1412340":{"ch":3,"crn":10899,"days":["T","R"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"2D/3D Computer Animation","place":["W8","105"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"green","minutes":[570,645],"points":[[43,33.14814814814815],[81,33.14814814814815]],"length":1.25},"1412444":{"ch":3,"crn":10900,"days":["T","R"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Game Design & Development","place":["W8","106"],"section":"11","time":["11:00 AM","12:15 PM"],"color":"orange","minutes":[660,735],"points":[[43,54.25925925925926],[81,54.25925925925926]],"length":1.25},"0202227":{"ch":3,"crn":10214,"days":["M","W"],"doctor":["Muhieddin AlQaddour","malqaddour@sharjah.ac.ae"],"name":"Critical Reading and Writing","place":["M10","101"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"purple","minutes":[570,645],"points":[[24,33.14814814814815],[62,33.14814814814815]],"length":1.25}}
        ],
        semester: 1,
        loggedIn: false,
        tightNav: false,
        dayFormat: "d"
    });
    if(!$localStorage.loggedIn && $location.path() != '/Calendar' && $location.path() != '/')
        $rootScope.redirect('/');
})

.controller('Sidenav', function($scope) {
    $scope.links = [{
        title: 'Dashboard',
        icon: 'tachometer'
    }, {
        title: 'Schedule',
        icon: 'calendar'
    }, {
        title: 'Courses',
        icon: 'book'
    }, {
        title: 'Email',
        icon: 'envelope'
    }, {
        title: 'Calendar',
        icon: 'globe'
    }];
})

.controller('Toolbar', function($scope, $mdDialog, $rootScope, $localStorage, $location) {
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
            $localStorage.loggedIn = true;
            $rootScope.redirect('Dashboard');
        }, function(){
            $localStorage.sid = null;
        });
    };
    $scope.logout = function() {
        $localStorage.sid = null;
        $localStorage.loggedIn = false;
        if($location.path() != "/Calendar")
            $rootScope.redirect('/');
    };
    $scope.semesters = [
        "Spring Semester 2016 - 2017",
        "Fall Semester 2016 - 2017",
        "Spring Semester 2015 - 2016",
        "Fall Semester 2015 - 2016"
    ];
    $scope.setDirection = function(direction) {
        $localStorage.direction = direction;
        $localStorage.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };
})

.controller('Index', function($scope, $interval, $mdDialog, $localStorage) {
    $scope.slideshow = "img/dashboard.png";
    $scope.counter = 1;
    $interval(function() {
        $scope.slideshow = "img/" + ["dashboard", "schedule", "courses", "email", "calendar"][$scope.counter] + ".png";
        $scope.counter = ($scope.counter + 1) % 5;
    }, 2000);
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
            $localStorage.loggedIn = true;
            $rootScope.redirect('Dashboard');
        }, function(){
            $localStorage.sid = null;
        });
    };

})

.controller('Dashboard', function($scope, $localStorage) {
    $scope.repeat = [0,1,2,3,4,5,6,7,8,9];
    $scope.announcements = [{
        title: 'Project Final Submission Due',
        course: 'Introduction to Computer Graphics',
        time: '13 hours ago'
    }, {
        title: 'Chapter 6 Available',
        course: 'Critical Reading and Writing',
        time: '2 days ago'
    }, {
        title: 'Notes - 3dsmax Available',
        course: '2D/3D Computer Animation',
        time: '3 days ago'
    }];

    $scope.emails = [{
        subject: 'Project Final Submission Due',
        sender: 'Introduction to Computer Graphics',
        time: '13 hours ago'
    }, {
        subject: 'Chapter 6 Available',
        sender: 'Critical Reading and Writing',
        time: '2 days ago'
    }, {
        subject: 'Notes - 3dsmax Available',
        sender: '2D/3D Computer Animation',
        time: '3 days ago'
    }];
    $scope.getInitials = function(name) {
        var words = name.split(' ');
        return (words[0].slice(0, 1) + words[1].slice(0, 1)).toUpperCase();
    };

    $scope.tasks = [{
        title: 'Project Final Submission Due',
        group: 'Introduction to Computer Graphics',
        day: 'Today',
        time: '11:59 AM'
    }, {
        title: 'Chapter 6 Available',
        group: 'Critical Reading and Writing',
        day: 'Tomorrow',
        time: '1:59 AM'
    }, {
        title: 'Notes - 3dsmax Available',
        group: '2D/3D Computer Animation',
        day: 'In Two days',
        time: '5:59 AM'
    }];

    $scope.classes = {
        "1412340": $localStorage.semesters[1]["1412340"],
        "1412444": $localStorage.semesters[1]["1412444"]
    };
    $scope.grades = [{
        course: 'Networking Fundamentals',
        letter: 'A',
        color: 'green'
    }, {
        course: 'Multimedia Programming & Design',
        letter: 'B',
        color: 'lime'
    }, {
        course: 'Principles of Marketing',
        letter: 'C',
        color: 'orange'
    }, {
        course: 'Statistics for Science',
        letter: 'D',
        color: 'red'
    }];
})

.controller('Schedule', function($scope, $mdDialog, $localStorage) {
    if($localStorage.semester == -1)
        $localStorage.semester = 1;
    $scope.days = ["Sun", "Mon", "Tue", "Wed", "Thu"];
    $scope.height = 14.074074074074074;
    $scope.labels = [[8,"AM"],[9,"AM"],[10,"AM"],[11,"AM"],[12,"PM"],[1,"PM"],[2,"PM"]];
    $scope.fractions = [0.5,1.5,2.5,3.5,4.5,5.5,6.5];
    $scope.dates = ["5/7","5/8","5/9","5/10","5/11"];

    $scope.cancel = $mdDialog.cancel;
    $scope.showClass = function(event, id, x) {
        $scope.class = $localStorage.semesters[$localStorage.semester][id];
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

.controller('Courses', function($scope, $localStorage) {
    for (var firstCourseId in $localStorage.semesters[$localStorage.semester]) break;
    $localStorage.course = firstCourseId;
    $scope.repeat = new Array(12);
    $scope.mass = false;
    $scope.all = false;
    $scope.announcements = [{
        title: 'There Will Be No Classes Next Week!',
        time: '13 hours ago'
    }, {
        title: 'Chapter 6 is Now Available',
        time: '2 days ago'
    }, {
        title: 'Be Prepared For a Quiz Tomorrow',
        time: '3 days ago'
    }];

    $scope.tasks = [{
        title: 'Project Final Submission Due',
        group: 'By Course',
        day: 'Today',
        time: '11:59 AM'
    }, {
        title: 'Study Chapter 5',
        group: 'My Task',
        day: 'Tomorrow',
        time: '1:59 AM'
    }, {
        title: 'Final Exam',
        group: 'By Course',
        day: 'In Two days',
        time: '5:59 AM'
    }];
})

.controller('Email', function($scope) {
    $scope.filter = 0;
    $scope.repeat = new Array(15);
    $scope.content = [{
        initial: 'D',
        title: 'Personal Email #',
        sender: function(index) { return 'Doctor Name #' + index + ' <doctor' + index + '@sharjah.ac.ae>'; },
        time: ' Days Ago'
    }, {
        initial: 'C',
        title: 'Course Announcement #',
        sender: function(index) { return 'Course Name #' + index; },
        time: ' Hours Ago'
    }, {
        initial: 'S',
        title: 'New Announcement #',
        sender: function(index) { return 'Sender Name #' + index + ' <doctor' + index + '@sharjah.ac.ae>'; },
        time: ' Minutes Ago'
    }];
    ($scope.openEmail = function(index) {
        $scope.current = $scope.content[$scope.filter];
        $scope.current.index = index + 1;
    })(0);
})

.controller('Calendar', function($scope, $filter) {
    $scope.selectedDate = new Date();
    $scope.firstDayOfWeek = 6; // First day of the week, 0 for Sunday, 1 for Monday, etc.
    $scope.tooltips = true;

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
    return (url || 'home') + '.html';
}
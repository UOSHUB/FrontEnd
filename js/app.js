angular.module('UOSHUB', ['ngMaterial', 'ngRoute'])

.config(function($locationProvider, $compileProvider, $mdAriaProvider, $mdThemingProvider, $mdIconProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $compileProvider.debugInfoEnabled(false);
    $mdAriaProvider.disableWarnings();
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue-grey')
        .backgroundPalette('blue-grey');
    $mdIconProvider.icon("logo", "/static/img/logo.svg");
    $routeProvider.when('/', {
        templateUrl: filePath()
    }).when('/Dashboard', {
        templateUrl: filePath('dashboard')
    }).when('/Schedule', {
        templateUrl: filePath('schedule')
    }).when('/Courses', {
        templateUrl: filePath('courses')
    }).when('/Email', {
        templateUrl: filePath('email')
    }).when('/Calendar', {
        templateUrl: filePath('calendar')
    });
})

.run(function($location, $rootScope) {
    $rootScope.redirect = function(link) {
        $location.path(link);
    };
})

.controller('sidenav', function($scope, $rootScope) {
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

.controller('toolbar', function($scope, $mdDialog, $rootScope) {
    $scope.dialog = $mdDialog;
    $rootScope.status = 'logged-out';
    $scope.login = function(event) {
        $mdDialog.show({
            controller: 'toolbar',
            templateUrl: filePath('login'),
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true
        }).then(function(sid) {
            $scope.sid = sid;
            $rootScope.$emit('login');
            $rootScope.status = 'logged-in';
            $rootScope.redirect('Dashboard');
        }, function(){});
    };
});

function filePath(url) {
    return '/static/' + (url || 'index') + '.html';
}
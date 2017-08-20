var app = angular.module('UOSHUB', ['ngMaterial', 'ngRoute', 'ngStorage', 'materialCalendar'])

.config(["$locationProvider", "$compileProvider", "$mdAriaProvider", "$mdThemingProvider",
         "$mdIconProvider", "$localStorageProvider", "$routeProvider", "$loadProvider",

function($locationProvider, $compileProvider, $mdAriaProvider, $mdThemingProvider,
         $mdIconProvider, $localStorageProvider, $routeProvider, $loadProvider) {
    $locationProvider.html5Mode(true);
    $compileProvider.debugInfoEnabled(false);
    $mdAriaProvider.disableWarnings();
    $localStorageProvider.setKeyPrefix('');
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue-grey');
    $mdIconProvider.icon("logo", "/static/img/logo.svg")
        .icon("md-tabs-arrow", "/static/img/tabs-arrow-icon.svg");
    var $load = $loadProvider.$get();
    $routeProvider
        .when('/', $load('welcome'))
        .when('/dashboard/', $load('dashboard', true))
        .when('/schedule/', $load('schedule', true))
        .when('/courses/', $load('courses', true))
        .when('/email/', $load('email', true))
        .when('/calendar/', $load('calendar'))
        .otherwise($load('notfound', false, "Page not found"));
}])

.run(["$ls",

function($ls) {
    $ls.$default({
        semesters: [
            {"1411445":{"ch":3,"crn":21155,"days":["T","R"],"doctor":["Djedjiga Mouheb","dmouheb@sharjah.ac.ae"],"name":"IT Application in E-Commerce","place":["W8","105"],"section":"11","time":["8:00 AM","9:15 AM"],"color":"red","minutes":[480,555],"points":[[43,12.037037037037038],[81,12.037037037037038]],"length":1.25},"1411490":{"ch":3,"crn":21167,"days":["T","R"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Topics in Computer Science I","place":["W8","105"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"teal","minutes":[570,645],"points":[[43,33.14814814814815],[81,33.14814814814815]],"length":1.25},"1412341":{"ch":3,"crn":21163,"days":["M","W"],"doctor":["Imran N. Junejo","ijunejo@sharjah.ac.ae"],"name":"3D Design for Web","place":["W8","106"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"green","minutes":[570,645],"points":[[24,33.14814814814815],[62,33.14814814814815]],"length":1.25},"1412443":{"ch":3,"crn":21168,"days":["M","W"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Human-Computer Interaction","place":["W9","005"],"section":"11","time":["12:30 PM","1:45 PM"],"color":"orange","minutes":[750,825],"points":[[24,75.37037037037038],[62,75.37037037037038]],"length":1.25},"0602246":{"ch":3,"crn":20935,"days":["M","W"],"doctor":["Wael A. Allam","wallam@sharjah.ac.ae"],"name":"Human Rights in Islam & International Declaration","place":["M1","023"],"section":"02A","time":["11:00 AM","12:15 PM"],"color":"purple","minutes":[660,735],"points":[[24,54.25925925925926],[62,54.25925925925926]],"length":1.25}},
            {"1411341":{"ch":3,"crn":10889,"days":["M","W"],"doctor":["Manar Abu Talib","Mtalib@sharjah.ac.ae"],"name":"Web Programming","place":["W8","106"],"section":"11","time":["12:30 PM","1:45 PM"],"color":"red","minutes":[750,825],"points":[[24,75.37037037037038],[62,75.37037037037038]],"length":1.25},"1411440":{"ch":3,"crn":10893,"days":["M","W"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Introduction to Computer Graphics","place":["W8","005"],"section":"11","time":["8:00 AM","9:15 AM"],"color":"teal","minutes":[480,555],"points":[[24,12.037037037037038],[62,12.037037037037038]],"length":1.25},"1412340":{"ch":3,"crn":10899,"days":["T","R"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"2D/3D Computer Animation","place":["W8","105"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"green","minutes":[570,645],"points":[[43,33.14814814814815],[81,33.14814814814815]],"length":1.25},"1412444":{"ch":3,"crn":10900,"days":["T","R"],"doctor":["Naveed Ahmed","nahmed@sharjah.ac.ae"],"name":"Game Design & Development","place":["W8","106"],"section":"11","time":["11:00 AM","12:15 PM"],"color":"orange","minutes":[660,735],"points":[[43,54.25925925925926],[81,54.25925925925926]],"length":1.25},"0202227":{"ch":3,"crn":10214,"days":["M","W"],"doctor":["Muhieddin AlQaddour","malqaddour@sharjah.ac.ae"],"name":"Critical Reading and Writing","place":["M10","101"],"section":"11","time":["9:30 AM","10:45 AM"],"color":"purple","minutes":[570,645],"points":[[24,33.14814814814815],[62,33.14814814814815]],"length":1.25}}
        ],
        terms: {},
        selected: {
            semester: 1
        }
    });
}])

.factory('$ls', ["$localStorage", function($localStorage) {
    return $localStorage;
}])

.factory('$goto', ["$location", function($location) {
    return function(link) {
        $location.path(link.replace(/\/?$/, '/'));
    };
}])

.factory('$load', ["$rootScope", "$ls", "$goto", "$timeout", "$mdToast",

function($rootScope, $ls, $goto, $timeout, $mdToast) {
    return function(route, secure, title) {
        return {
            templateUrl: '/static/' + route + '.html',
            controller: route,
            resolve: angular.extend({
                pageTitle: function() { $rootScope.title = (title || route) + " - UOS HUB"; }
            }, secure && {
                security: function() {
                    if(!$ls.loggedIn) {
                        $goto('/');
                        $timeout(function() {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('You need to login first!')
                                    .position('top right')
                                    .parent($('#content'))
                                    .hideDelay(2000)
                            );
                        }, 300);
                    }
                }
            })
        };
    };
}]);
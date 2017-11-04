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
                pageTitle: function() { $rootScope.title = (title || route.capitalize()) + " - UOS HUB"; }
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
}])

.factory('$refresh', ["$rootScope", "$ls", "$http", "$timeout", "$interval",

function($rootScope, $ls, $http, $timeout, $interval) {
    var timezoneOffset = today.getTimezoneOffset() * 60000, delay = 5 * 60000;
    function setTimestamp() {
        $ls.timestamp = (new Date(Date.now() - timezoneOffset)).toISOString().slice(0, -5);
    }
    function update$ls(data, ls) {
        angular.forEach(data, function(list, key) {
            if(list.length > 0)
                ls[key] = list.concat(ls[key]);
            else if(list.length == undefined)
                update$ls(list, ls[key]);
        });
    }
    function refresh(queries) {
        $http.get("/api/refresh/" + $ls.timestamp + "/?" + queries.join('&')).then(function(response) {
            update$ls(response.data, $ls);
            setTimestamp();
        }, error);
    }
    if(!$ls.timestamp) setTimestamp();
    return function(queries) {
        $rootScope.refresh = $timeout(function() {
            refresh(queries);
            $rootScope.refresh = $interval(refresh, delay, 0, true, queries);
        }, Math.max((new Date($ls.timestamp)).getTime() + delay - Date.now(), 0));
    };
}])

.filter('timeDistance', function() {
    return function(date) {
        date = new Date(date);
        var period, now = new Date(), direction = "ago",
            time = (now - date) / 86400000;
        if(time < 0) {
            if(now.getDate() == date.getDate())
                return "Today";
            if(now.getDate() + 1 == date.getDate())
                return "Tomorrow";
            period = "day";
            direction = "left";
        } else if(time >= 1)
            period = "day";
        else {
            time *= 24;
            if(time >= 1)
                period = "hour";
            else {
                time *= 60;
                period = "min";
            }
        }
        time = Math.abs(parseInt(time));
        if(time > 1) period += "s";
        return [time, period, direction].join(" ");
    };
})

.filter('find', function() {
    return function(items, id) {
        for(var i = 0; i < items.length; i++)
            if(id == items[i].id)
                return items[i];
    };
});
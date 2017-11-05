app.factory("$ls", ["$localStorage", function($localStorage) {
    return $localStorage;
}])

.factory("$goto", ["$location", function($location) {
    return function(link) {
        $location.path(link.replace(/\/?$/, "/"));
    };
}])

.factory("$toolbar", function() {
    return {};
})

.factory("$load", ["$rootScope", "$ls", "$goto", "$timeout", "$interval", "$mdToast",

function($rootScope, $ls, $goto, $timeout, $interval, $mdToast) {
    var toast = $mdToast.simple().hideDelay(2000)
        .position("top right").parent($("#content"))
        .textContent("You need to login first!");
    function onLoggedOut() {
        if(!$ls.loggedIn) {
            $goto("/");
            $timeout(function() {
                $mdToast.show(toast);
            }, 300);
        }
    }
    return function(route, secure, title) {
        return {
            templateUrl: "/static/" + route + ".html",
            controller: route,
            resolve: angular.extend({
                onload: function() {
                    $rootScope.title = (title || route.capitalize()) + " - UOS HUB";
                    $timeout.cancel($rootScope.refresh);
                    $interval.cancel($rootScope.refresh);
                }
            }, secure && {
                security: onLoggedOut
            })
        };
    };
}])

.factory("$refresh", ["$rootScope", "$ls", "$http", "$timeout", "$interval",

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
        $http.get("/api/refresh/" + $ls.timestamp + "/?" + queries.join("&")).then(function(response) {
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
}]);
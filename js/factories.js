app.factory("$ls", ["$localStorage", function($localStorage) {
    return $localStorage;
}])

.factory("$goto", ["$location", function($location) {
    return function(link) {
        $location.path(link.replace(/\/?$/, "/"));
    };
}])

.factory("$toast", ["$mdToast", function($mdToast) {
    var toast = $mdToast.simple().hideDelay(2000).parent($("#content"));
    return function(message, side) {
        $mdToast.show(toast.textContent(message).position("top " + (side || "right")));
    };
}])

.factory("$toolbar", ["$sce", function($sce) {
    var termName = {"10": "Fall", "20": "Spring", "30": "Summer"};
    return {
        termTitle: function(termCode) {
            var yearString = termCode.slice(0, 4);
            return $sce.trustAsHtml(
                termName[termCode.slice(4)] + " " + yearString +
                "&nbsp;-&nbsp;" + (Number(yearString) + 1)
            );
        }
    };
}])

.factory("$load", ["$rootScope", "$ls", "$goto", "$timeout", "$interval", "$toast",

function($rootScope, $ls, $goto, $timeout, $interval, $toast) {
    term = ($ls.student || {}).term || (month > 7 ? year + "10" : year - 1 + (month < 6 ? "20" : "30"));
    function onLoggedOut() {
        if(!$ls.session) {
            $goto("/");
            $timeout(function() {
                $toast("You need to login first!");
            }, 300);
        }
    }
    return function(route, insecure, title) {
        return {
            templateUrl: "/static/" + route + ".html",
            controller: route,
            resolve: angular.extend({
                onload: function() {
                    $rootScope.title = (title || route.capitalize()) + " | UOS HUB";
                    if($rootScope.refresh) {
                        $interval.cancel($rootScope.refresh);
                        delete $rootScope.refresh;
                    }
                }
            }, insecure || {
                security: onLoggedOut
            })
        };
    };
}])

.factory("$refresh", ["$rootScope", "$ls", "$http", "$timeout", "$interval",

function($rootScope, $ls, $http, $timeout, $interval) {
    var timezoneOffset = today.getTimezoneOffset() * 60000, delay = 5 * 60000;
    function setTimestamp() {
        $ls.session.timestamp = (new Date(Date.now() - timezoneOffset)).toISOString().slice(0, -5);
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
        $http.get("/api/refresh/" + $ls.session.timestamp + "/?" + queries.join("&")).then(function(response) {
            update$ls(response.data, $ls);
            setTimestamp();
        }, error);
    }
    return function(queries) {
        if(!$ls.session.timestamp) setTimestamp();
        $timeout(function() {
            refresh(queries);
            $rootScope.refresh = $interval(refresh, delay, 0, true, queries);
        }, Math.max((new Date($ls.session.timestamp)).getTime() + delay - Date.now(), 0));
    };
}])

.factory("$emailsLoader", ["$ls", "$http", function($ls, $http) {
    return function(type) {
        var loading = ($ls.emails[type] || []).length;
        function getEmails(load) {
            if(load >= loading) {
                var count = $ls.emails[type] ? 10 : 20;
                $http.get("/api/emails/" + type + "/" + count + "/" + loading + "/").then(function(response) {
                    $ls.emails[type] = ($ls.emails[type] || []).concat(response.data);
                }, error);
                loading += count;
            }
        };
        return {
            getItemAtIndex: function(index) {
                if(!$ls.emails[type] || index >= $ls.emails[type].length)
                    return getEmails(index);
                return $ls.emails[type][index];
            },
            getLength: function() {
                return ($ls.emails[type] || []).length + 1;
            }
        };
    };
}]);
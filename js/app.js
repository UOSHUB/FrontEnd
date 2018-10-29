var version = 0.86;

var app = angular.module("UOSHUB", ["ngMaterial", "ngRoute", "ngStorage", "materialCalendar"])

.config(["$locationProvider", "$compileProvider", "$mdAriaProvider", "$mdThemingProvider",
         "$mdIconProvider", "$localStorageProvider", "$routeProvider", "$loadProvider",

function($locationProvider, $compileProvider, $mdAriaProvider, $mdThemingProvider,
         $mdIconProvider, $localStorageProvider, $routeProvider, $loadProvider) {
    $locationProvider.html5Mode(true);
    $compileProvider.debugInfoEnabled(false);
    $mdAriaProvider.disableWarnings();
    $localStorageProvider.setKeyPrefix("");
    $mdThemingProvider.theme("default")
        .primaryPalette("green")
        .accentPalette("blue-grey");
    $mdIconProvider.icon("logo", "/static/img/logo.svg")
        .icon("md-tabs-arrow", "/static/img/tabs-arrow-icon.svg");
    var $load = $loadProvider.$get();
    $routeProvider
        .when("/", $load("welcome", true))
        .when("/dashboard/", $load("dashboard"))
        .when("/schedule/", $load("schedule"))
        .when("/courses/", $load("courses"))
        .when("/emails/", $load("emails"))
        .when("/reports/", $load("reports"))
        .when("/calendar/", $load("calendar", true))
        .otherwise($load("notfound", false, "Page not found"));
}])

.filter("timeDistance", function() {
    return function(date) {
        if(!date) return;
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

.filter("find", function() {
    return function(items, key, value, command) {
        for(var i = 0; i < items.length; i++)
            if(value == items[i][key])
                if(command == "delete")
                    return items.splice(i, 1);
                else return items[i];
    };
});
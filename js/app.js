angular.module('UOSHUB', ['ngMaterial'])

.config(function($locationProvider){
    $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
})

.run(function($rootScope, $window) {
    ($rootScope.setUrl = function(url) {
        $rootScope.url = '/static/' + (url || 'index') + '.html';
    })($window.location.pathname.split('/')[1]);
    
    $rootScope.redirect = function(url) {
        $window.history.pushState(null, null, '/' + url);
        $rootScope.setUrl(url);
    }
});

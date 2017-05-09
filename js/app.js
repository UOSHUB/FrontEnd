angular.module('UOSHUB', ['ngMaterial'])

.config(function($locationProvider, $compileProvider, $mdAriaProvider, $mdThemingProvider){
    $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });
    $compileProvider.debugInfoEnabled(false);
    $mdAriaProvider.disableWarnings();
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue-grey')
        .backgroundPalette('blue-grey');
})

.run(function($rootScope, $window) {
    $rootScope.url = filePath($window.location.pathname.split('/')[1]);
    $rootScope.redirect = function(url) {
        $window.history.pushState(null, null, '/' + url);
        $rootScope.url = filePath(url);
    };
})

.controller('toolbar', function($scope, $mdDialog) {
    $scope.login = function(event) {
        $mdDialog.show({
            controller: 'toolbar',
            templateUrl: filePath('login'),
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true
        }).then(function(sid) {
            $scope.sid = sid;
        }, function(){});
    };
    $scope.dialog = $mdDialog;
});

function filePath(url) {
    return '/static/' + (url || 'index') + '.html';
}
app.directive("submit", ["$http", "$timeout", "$toast", "$mdDialog",

function ($http, $timeout, $toast, $mdDialog) {
    var target = $("#confirm"), dialog = {
        templateUrl: "/static/confirm.html",
        parent: body,
        openFrom: target,
        closeTo: target,
        clickOutsideToClose: true,
        controller: function($scope, files) {
            $scope.hide = $mdDialog.hide;
            $scope.cancel = $mdDialog.cancel;
            $scope.files = files;
        }
    };
    function confirmSubmission(event, subUrl, rawFiles) {
        dialog.locals = {files: rawFiles};
        $mdDialog.show(dialog).then(function() {
            var files = new FormData();
            angular.forEach(rawFiles, function(file, index) {
                files.append("file" + index, file);
            });
            $http.post("/api/submit/" + subUrl, files, {
                headers: {"Content-Type": undefined}
            }).then(function () {
                $toast("Submitted files successfully");
            }, function() {
                $toast("Faild to submit files!");
            });
        }, nothing);
    }
    return {
        link: function ($scope, element, attr) {
            $timeout(function() {
                var input = element.find("input");
                input.bind("change", function() {
                    confirmSubmission(element, attr.submit, input[0].files);
                });
                element.on("click", function() {
                    input[0].click();
                });
            });
        }
    };
}]).filter("bytes", function() {
	return function(bytes, precision) {
		if(isNaN(parseFloat(bytes)) || !isFinite(bytes))
            return "-";
		if(typeof precision === "undefined") precision = 1;
		var units = ["bytes", "kB", "MB", "GB", "TB", "PB"],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  " " + units[number];
	}
});
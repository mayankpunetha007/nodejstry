var myApp = angular.module('myApp',[]);
var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.loadFeeds = function() {
        $http.post('/getUserInfo').then(function (res) {
            if (!res.data.success) {

            } else {
                location.reload();
            }
        }).error(function () {

        });
    }
    $scope.newTask = function() {

    }
    $scope.logout = function() {
        $http.post('/logout').then(function (res) {
            if (!res.data.success) {

            } else {
                location.reload();
            }
        }).error(function () {

        });
    }

}]);
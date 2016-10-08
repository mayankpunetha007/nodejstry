var myApp = angular.module('myApp',[]);
var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {

    $scope.register = function () {
        var login = document.getElementById('login-form');
        login.setAttribute("hidden", true);
        var login = document.getElementById('registration-form');
        login.removeAttribute("hidden")
    };

    $scope.registerNow = function () {
        if ($scope.passwordReg !== $scope.passwordConfirm) {
            $scope.error = 'Password and confirm password do not match';
            return;
        }
        $http.post('/register', {'username': $scope.emailReg, 'password': $scope.passwordReg, 'name':$scope.name});
    }

    $scope.login = function () {
        if ($scope.passwordReg !== $scope.passwordConfirm) {
            $scope.error = 'Password and confirm password do not match';
            return;
        }
        $http.post('/login', {'email': $scope.email, 'password': $scope.pass}).then(function (res) {
            if(!res.success){

            }else{
                $window.location.href = "/home"
            }
        }).error(function(){

        });
    }

    $scope.newTask = function() {
        if ($scope.passwordReg !== $scope.passwordConfirm) {
            $scope.error = 'Password and confirm password do not match';
            return;
        }
    }

}]);
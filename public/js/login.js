var myApp = angular.module('myApp', ['toaster']);
myApp.controller('LoginCtrl', ['$scope', '$http', 'toaster', function ($scope, $http, toaster) {

    /**
     * Show Registeration form
     */
    $scope.register = function () {
        var login = document.getElementById('login-form');
        login.setAttribute("hidden", 'true');
        login = document.getElementById('registration-form');
        login.removeAttribute("hidden")
    };

    /**
     * Gather user details and register
     */
    $scope.registerNow = function () {
        if ($scope.passwordReg !== $scope.passwordConfirm) {
            toaster.pop({
                type: 'error',
                title: 'Password and confirm password do not match',
                timeout: 1500
            });
            return;
        }
        $http.post('/register', {
            'username': $scope.emailReg,
            'password': $scope.passwordReg,
            'name': $scope.name
        }).then(function (res) {
            if (!res.data.success) {
                toaster.pop({
                    type: 'error',
                    title: 'Failed to register User. Does user already exist?',
                    timeout: 1500
                });
            } else {
                var login = document.getElementById('login-form');
                login.removeAttribute('hidden');
                var login = document.getElementById('registration-form');
                login.setAttribute('hidden', 'true');
                toaster.pop({
                    type: 'success',
                    title: 'User Registered Please login!',
                    timeout: 1500
                });
            }
        })
    };

    /**
     * Gather user credentials and attempt login
     */
    $scope.login = function () {
        $http.post('/login', {'email': $scope.email, 'password': $scope.pass}).then(function (res) {
            if (!res.data.success) {
                toaster.pop({
                    type: 'error',
                    title: 'Check Username Passwaord',
                    timeout: 1500
                });
            } else {
                location.reload();
            }
        })
    };
}]);
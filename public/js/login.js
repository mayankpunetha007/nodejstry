var myApp = angular.module('myApp', ['toaster']);
myApp.controller('LoginCtrl', ['$scope', '$http', 'toaster', function ($scope, $http, toaster) {


    /**
     * Show Registeration form
     */
    $scope.register = function (status) {

            var hide = 'login-form';
            var show = 'registration-form';
            var active = 'register-tab';
            var inactive = 'login-tab';
            if (status == false) {
                hide = 'registration-form';
                show = 'login-form';
                active = 'login-tab';
                inactive = 'register-tab';
            }
            document.getElementById(hide).setAttribute('hidden', 'true');
            document.getElementById(show).removeAttribute('hidden');
            document.getElementById(active).classList.add('active');
            document.getElementById(inactive).classList.remove('active');

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
                    title: res.data.message ? res.data.message : 'Failed to register User. Does user already exist?',
                    timeout: 1500
                });
            } else {
                $scope.register(false);
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
                    title: res.data.message ? res.data.message : 'Check Username Passwaord',
                    timeout: 1500
                });
            } else {
                location.reload();
            }
        })
    };
}]);
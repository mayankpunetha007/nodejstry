var myApp = angular.module('myApp', ['toaster']);
myApp.controller('AppCtrl', ['$scope', '$http', 'toaster', function($scope, $http, toaster) {

    $scope.init = function() {
        $http.get('/getTaskList').then(function (res) {
            $scope.name = res.data.name;
            $scope.tasks = res.data.taskList;
            for(var i =0;i<$scope.tasks.length;i++){
                $scope.tasks[i].edit = false;
            }
        });
    };

    $scope.newTask = function() {
        var subject = $scope.subject;
        $http.post('/addTask', {'subject': subject, 'content': ''}).then(function (res) {
            if (!res.data.success) {

            } else {
                location.reload();
            }
        });
    };

    $scope.logout = function() {
        $http.post('/logout').then(function (res) {
            if (!res.data.success) {

            } else {
                location.reload();
            }
        }).error(function () {

        });
    };

    // Delete Note
    $scope.delete = function (i) {
        var r = confirm("Are you sure you want to delete this note?");
        if (r == true)
            $scope.tasks.splice(i, 1);
    };

    // Update Note
    $scope.update = function(index, id) {
        var newContent = document.getElementById('task-id-'+id).innerHTML;
        if(newContent === $scope.tasks[index].content){
            return;
        }
        $http.post('/updateTask', {'id': id, 'content': newContent}).then(function (res) {
            if (!res.data.success) {
                $scope.tasks[index].edit = error
            } else {
                $scope.tasks[index] = res.data.task;
                $scope.tasks[index].edit = false;
            }
        });

        $scope.tasks[index].edit = 'error';
    };



}]);
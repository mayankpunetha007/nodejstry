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
    };

    $scope.newTask = function() {

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

    $scope.tasks = [];

    // Add New Note
    $scope.addNote = function(){
        $scope.newNote = {};
        $scope.newNote.createdOn = Date.now();
        $scope.newNote.text = ' ';
        $scope.newNote.edit = true;
        $scope.notes.push($scope.newNote);
        $scope.newNote = {};
    };

    // Delete Note
    $scope.delete = function (i) {
        var r = confirm("Are you sure you want to delete this note?");
        if (r == true)
            $scope.tasks.splice(i, 1);
    };

    // Update Note
    $scope.update = function(i, note) {
        $scope.tasks[i].text = note;
        $scope.tasks[i].edit = false;
    };

}]);
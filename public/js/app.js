var myApp = angular.module('myApp', ['toaster']);
myApp.controller('AppCtrl', ['$scope', '$http', 'toaster', function($scope, $http, toaster) {

    $scope.init = function() {
        $http.get('/getnoteList').then(function (res) {
            $scope.name = res.data.name;
            $scope.notes = res.data.noteList;
            for(var i =0;i<$scope.notes.length;i++){
                $scope.notes[i].edit = false;
            }
        });
    };

    $scope.newnote = function() {
        var subject = $scope.subject;
        $http.post('/addnote', {'subject': subject, 'content': ''}).then(function (res) {
            if (!res.data.success) {
                toaster.pop({
                    type: 'error',
                    title: 'Failed to add note',
                    timeout: 1500
                });
            } else {
                var input = document.getElementById('subject');
                input.getElementsByTagName('input')[0].value = '';
                input.setAttribute('hidden', true);
                res.data.note.edit = false;
                $scope.notes.push(res.data.note);
                toaster.pop({
                    type: 'success',
                    title: 'Note Succesfully added',
                    timeout: 1500
                });
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
    $scope.delete = function (i, id) {
        var r = confirm("Are you sure you want to delete this note?");
        if (r == true){
            $http.post('/deletenote', {'id': id}).then(function (res) {
                if (!res.data.success) {
                    toaster.pop({
                        type: 'error',
                        title: 'Failed to delete note',
                        timeout: 1500
                    });
                } else {
                    $scope.notes.splice(i, 1);
                }
            });
        }
    };

    // Update Note
    $scope.update = function(index, id) {
        var newContent = document.getElementById('note-id-'+id).innerHTML;
        if(newContent === $scope.notes[index].content){
            return;
        }
        $http.post('/updatenote', {'id': id, 'content': newContent}).then(function (res) {
            if (!res.data.success) {
                $scope.notes[index].edit = error
            } else {
                $scope.notes[index] = res.data.note;
                $scope.notes[index].edit = false;
            }
        });

        $scope.notes[index].edit = 'error';
    };



}]);
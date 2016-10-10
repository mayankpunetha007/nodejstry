var myApp = angular.module('myApp', ['toaster']);

myApp.controller('AppCtrl', ['$scope', '$http', 'toaster', function ($scope, $http, toaster) {

    /**
     * Initialize Notes for the current logged in user
     */
    $scope.init = function () {
        $http.get('/getnoteList').then(function (res) {
            $scope.name = res.data.name;
            $scope.notes = res.data.noteList;
            for (var i = 0; i < $scope.notes.length; i++) {
                $scope.notes[i].edit = false;
            }
        });
    };

    /**
     * Create a new note
     */
    $scope.newnote = function () {
        var subject = $scope.subject;
        $http.post('/addnote', {'subject': subject, 'content': ''}).then(function (res) {
            if (!res.data.success) {
                toaster.pop({
                    type: 'error',
                    title: res.data.message ? res.data.message : 'Failed to add note',
                    timeout: 1500
                });
            } else {
                var input = document.getElementById('subject');
                input.getElementsByTagName('input')[0].value = '';
                input.setAttribute('hidden', "true");
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

    /**
     * Terminates current user session
     */
    $scope.logout = function () {
        $http.post('/logout').then(function (res) {
            if (!res.data.success) {

            } else {
                location.reload();
            }
        }, function (error) {
            toaster.pop({
                type: 'error',
                title: 'Are you even logged in?',
                timeout: 1500
            });
            location.reload();
        });
    };


    /**
     * Delete the note specified by
     * @param i Index of note in angular data notes array
     * @param id Id for the note as stroed in db
     */
    $scope.delete = function (i, id) {
        var r = confirm("Are you sure you want to delete this note?");
        if (r == true) {
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

    /**
     * Edit the current note of
     * @param id Id for the note
     */
    $scope.edit = function (id) {
        var newContent = document.getElementById('note-id-' + id);
        newContent.val(newContent.val());
        newContent.focus();
    };

    /**
     * Check if there are any changes to the note specified by
     * @param index Angular data index
     * @param id The id for the note as in db
     * @returns {boolean} True if the data is different
     */
    $scope.isChanged = function (index, id) {
        var newContent = document.getElementById('note-id-' + id).innerText;
        if (newContent == $scope.notes[index].content) {
            $scope.notes[index].edit = false;
            return false;
        }
        $scope.notes[index].edit = true;
        return true;
    };

    /**
     * Update the content of the note specified by
     * @param index Angular data index for notes
     * @param id Id of the note
     */
    $scope.update = function (index, id) {
        if (!$scope.isChanged(index, id)) {
            toaster.pop({
                type: 'warn',
                title: 'Nothing to update',
                timeout: 1500
            });
            return;
        }
        var newContent = document.getElementById('note-id-' + id).value;
        $http.post('/updatenote', {'id': id, 'content': newContent}).then(function (res) {
            if (!res.data.success) {
                $scope.notes[index].edit = error
            } else {
                $scope.notes[index] = res.data.note;
                $scope.notes[index].edit = false;
                toaster.pop({
                    type: 'info',
                    title: 'Note Succesfully Updated',
                    timeout: 1500
                });
            }
        }, function errorCallback(response) {
            toaster.pop({
                type: 'error',
                title: 'Failed to save note',
                timeout: 1500
            });
        });

        $scope.notes[index].edit = 'error';
    };


}]);
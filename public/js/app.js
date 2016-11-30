var myApp = angular.module('myApp', ['toaster']);

myApp.controller('AppCtrl', ['$scope', '$http', 'toaster', function ($scope, $http, toaster) {

    $scope.notes =[];
    /**
     * Hide popup
     */
    $scope.hidePopup = function ($event) {
        document.getElementById('subject').setAttribute('hidden', true);
        $scope.subject = '';
        if ($event)
            $event.stopPropagation();
    };

    /**
     * Initialize Notes for the current logged in user
     */
    $scope.init = function () {
        $http.get('/getnoteList').then(function (res) {
            var notes = res.data.noteList;
            notes.sort(function(a, b) {
                return new Date(b.createdAt) - new Date(a.createdAt)
            });
            for (var i = 0; i < notes.length; i++) {
                notes[i]['edit'] = true;
                notes[i]['tempContent'] = notes[i].content;
            }
            $scope.name = res.data.name;
            $scope.notes = notes;

        });
    };

    /**
     * Undo the current Note
     */
    $scope.redo = function (index) {
        $http.post('/redo', {'note': $scope.notes[index]}).then(function (res) {
            if (!res.data.success) {
                $scope.notes[index].edit = 'error';
                toaster.pop({
                    type: 'error',
                    title: res.data.message ? res.data.message : 'Failed to add note',
                    timeout: 1500
                });
            } else {
                $scope.notes[index] = res.data.note;
                $scope.notes[index].tempContent = res.data.note.content;
                $scope.notes[index].content = res.data.note.content;
                $scope.notes[index].edit = true;
                toaster.pop({
                    type: 'info',
                    title: 'Note Succesfully Updated',
                    timeout: 1500
                });
            }
        }, function errorCallback(response) {
            toaster.pop({
                type: 'error',
                title: response.data.error ? response.data.error : 'Failed to save note',
                timeout: 1500
            });
        });

        $scope.notes[index].edit = 'error';
    };

    /**
     * Redo the current note
     */
    $scope.undo = function (index) {
        $http.post('/undo', {'note': $scope.notes[index]}).then(function (res) {
            if (!res.data.success) {
                $scope.notes[index].edit = 'error';
                toaster.pop({
                    type: 'error',
                    title: res.data.message ? res.data.message : 'Failed to add note',
                    timeout: 1500
                });
            } else {
                $scope.notes[index] = res.data.note;
                $scope.notes[index].tempContent = res.data.note.content;
                $scope.notes[index].content = res.data.note.content;
                $scope.notes[index].edit = true;
                toaster.pop({
                    type: 'info',
                    title: 'Note Succesfully Updated',
                    timeout: 1500
                });
            }
        }, function errorCallback(response) {
            toaster.pop({
                type: 'error',
                title: response.data.error ? response.data.error : 'Failed to save note',
                timeout: 1500
            });
        });

        $scope.notes[index].edit = 'error';
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
                $scope.hidePopup();
                res.data.note.edit = true;
                $scope.notes.push(res.data.note);
                toaster.pop({
                    type: 'info',
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
     */
    $scope.delete = function (i) {
        var r = confirm('Are you sure you want to delete this note?');
        if (r == true) {
            $http.post('/deletenote', {'id': $scope.notes[i].id}).then(function (res) {
                if (!res.data.success) {
                    toaster.pop({
                        type: 'error',
                        title: 'Failed to delete note',
                        timeout: 1500
                    });
                } else {
                    $scope.notes.splice(i, 1);
                    toaster.pop({
                        type: 'info',
                        title: 'Note successfully deleted',
                        timeout: 1500
                    });
                }
            });
        }
    };

    /**
     * Edit the current note of
     * @param $index $index for the note
     */
    $scope.edit = function ($index) {
        var newContent = document.getElementById('note-id-' + $scope.notes[$index].id);
        var temp = newContent.value;
        newContent.value = '';
        newContent.value = temp;
        newContent.focus();
    };

    /**
     * Check if there are any changes to the note specified by
     * @param index Angular data index
     * @returns {boolean} True if the data is different
     */
    $scope.isChanged = function (index) {
        if ($scope.notes[index].tempContent == $scope.notes[index].content) {
            $scope.notes[index].edit = true;
            return false;
        }
        $scope.notes[index].edit = false;
        return true;
    };

    /**
     * Update the content of the note specified by
     * @param index Angular data index for notes
     */
    $scope.update = function (index) {
        if (!$scope.isChanged(index)) {
            toaster.pop({
                type: 'warn',
                title: 'Nothing to update',
                timeout: 1500
            });
            return;
        }
        var id = $scope.notes[index].id;
        var newContent = document.getElementById('note-id-' + id).value;
        $http.post('/updatenote', {'note': $scope.notes[index], 'content': newContent}).then(function (res) {
            if (!res.data.success) {
                $scope.notes[index].edit = 'error';
                toaster.pop({
                    type: 'error',
                    title: 'Failed to save note. Please retry',
                    timeout: 1500
                });
            } else {
                $scope.notes[index] = res.data.note;
                $scope.notes[index].tempContent = res.data.note.content;
                $scope.notes[index].content = res.data.note.content;
                $scope.notes[index].edit = true;
                toaster.pop({
                    type: 'info',
                    title: 'Note Succesfully Updated',
                    timeout: 1500
                });
            }
        }, function errorCallback(response) {
            toaster.pop({
                type: 'error',
                title: response.data.error ? response.data.error : 'Failed to save note',
                timeout: 1500
            });
        });

        $scope.notes[index].edit = 'error';
    };

    $scope.noteVisible = function(){
        document.getElementById('subject').removeAttribute('hidden');
        document.getElementById('subject-input').focus();
    };


}]);
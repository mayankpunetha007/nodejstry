var model = require('./../model/model'),
    utils = require('./commonutils'),
    uuid = require('uuid');

exports.fetchNotes = function (res, sessionId) {
    var userDetails = utils.getUserDetails(sessionId);
    model.notes.findAll({where: {userId: userDetails.id}}).then(function (dbResults) {
        var noteList = [];
        for (var result in dbResults) {
            var noteInfo = dbResults[result].dataValues;
            noteInfo = utils.refineNotes(noteInfo);
            noteList.push(noteInfo);
        }
        res.send({'name': userDetails.name, 'noteList': noteList});
    }).catch(function (err) {
        console.log(err);
        res.send({'success': false, 'message': 'internal server Error'});
    });
};



exports.addUser = function (res, user) {
    model.User.findOne({
        where: {email: user.email}
    }).then(function (userDb) {
        if (userDb) {
            res.send({'success': false});
        } else {
            var passwordHash = utils.getPasswordHash(user.salt, user.pass);
            model.User.create({
                name: user.name,
                email: user.email,
                salt: user.salt,
                passwordhash: passwordHash
            });
            res.send({'success': true});
        }
    }).catch(function (err) {
        console.log(err);
        res.send({'success': false, 'message': 'internal server Error'});
    });
};


exports.undo = function (res, sessionId, note) {
    var userDetails = utils.getUserDetails(sessionId);
    model.notes.findOne({
        where: {id: note.id, userId: userDetails.id}
    }).then(function (dbnote) {
        if (dbnote) {
            dbnote = dbnote.dataValues;
            if(dbnote.latestOrder == 0){
                res.send({'success':false, 'message':'Nothing to undo'});
            }else {
                var singleNoteId = dbnote.order.res[dbnote.latestOrder-1];
                model.singleNote.findOne({where: {id: singleNoteId}}).then(function (singleNote) {
                    dbnote.currentNoteId = singleNote.id;
                    dbnote.currentContent = singleNote.content;
                    dbnote.currentVersion = singleNote.version;
                    dbnote.latestOrder = dbnote.latestOrder - 1;
                    model.notes.update(dbnote, {where: {'id': dbnote.id}}).then(function(){
                        dbnote = utils.refineNotes(dbnote);
                        res.send({'success': true, 'note': dbnote});
                    });
                });
            }
        }
        else {
            res.status(403).end();
        }
    }).catch(function (err) {
        console.log(err);
        res.send({'success': false, 'message': 'internal server Error'});
    });
};


exports.redo = function (res, sessionId, note) {
    var userDetails = utils.getUserDetails(sessionId);
    model.notes.findOne({
        where: {id: note.id, userId: userDetails.id}
    }).then(function (dbnote) {
        if (dbnote) {
            dbnote = dbnote.dataValues;
            if(dbnote.latestOrder == dbnote.order.res.length -1){
                res.send({'success':false, 'message':'Nothing to redo'});
            }else {
                var singleNoteId = dbnote.order.res[dbnote.latestOrder+1];
                model.singleNote.findOne({where: {id: singleNoteId}}).then(function (singleNote) {
                    dbnote.currentNoteId = singleNote.id;
                    dbnote.currentContent = singleNote.content;
                    dbnote.currentVersion = singleNote.version;
                    dbnote.latestOrder = dbnote.latestOrder + 1;
                    model.notes.update(dbnote, {where: {'id': dbnote.id}}).then(function(){
                        dbnote = utils.refineNotes(dbnote);
                        res.send({'success': true, 'note': dbnote});
                    });
                });
            }
        }
        else {
            res.status(403).end();
        }
    }).catch(function (err) {
        console.log(err);
        res.send({'success': false, 'message': 'internal server Error'});
    });
};


exports.deletenote = function (res, sessionId, id) {
    var userDetails = utils.getUserDetails(sessionId);
    model.notes.findOne({
        where: {id: id, userId: userDetails.id}
    }).then(function (dbnote) {
        if (dbnote) {
            model.notes.destroy({where: {'id': dbnote.id, 'userId': dbnote.userId}}).then(function () {
                model.singleNote.destroy({where: {'noteId': dbnote.id}}).then(function () {
                    res.send({'success': true});
                });
            });
        }
        else {
            res.status(403).end();
        }
    }).catch(function (err) {
        console.log(err);
        res.send({'success': false, 'message': 'internal server Error'});
    });
};

exports.addnote = function (res, sessionId, subject, content) {
    var userDetails = utils.getUserDetails(sessionId);
    var notesId = uuid();
    var singleNoteId = uuid();
    var array =[];
    array.push(singleNoteId);
    var order = {'res':array};
    model.notes.create({
        id: notesId,
        currentNoteId: singleNoteId,
        currentVersion: 1,
        currentSubject: subject,
        currentContent: content,
        userId: userDetails.id,
        order: order,
        latestVersion: 1,
        latestOrder: 0
    }).then(function (notes) {
        model.singleNote.create({
            id: singleNoteId,
            version: 1,
            subject: notes.currentSubject,
            content: notes.currentContent,
            noteId: notesId
        }).then(function(note){
            note = note.dataValues;
            note = utils.refineSingleNote(note);
            res.send({'success': true, 'note': note});
        });
    }).catch(function (err) {
        console.log(err);
        res.send({'success': false, 'message': 'internal server Error'});
    });
};

exports.updatenote = function (res, sessionId, note, noteContent) {
    var userDetails = utils.getUserDetails(sessionId);
    model.notes.find({
        where: {id: note.id, userId: userDetails.id}
    }).then(function (dbnote) {
        if (dbnote) {
            dbnote = dbnote.dataValues;
            if (dbnote.content === noteContent) {
                res.send({'success': false, 'message': 'Nothing to update'});
            } else {
                var noteId = uuid();
                model.singleNote.build({id: noteId, content : noteContent, noteId : dbnote.id, subject : dbnote.subject, version : dbnote.latestVersion + 1}).save().then(function(newNote) {
                    dbnote.order.res.splice(dbnote.latestOrder+1, 0, noteId);
                    dbnote.currentNoteId = noteId;
                    dbnote.currentContent = noteContent;
                    dbnote.latestVersion = dbnote.latestVersion + 1;
                    dbnote.currentVersion = dbnote.latestVersion + 1;
                    dbnote.latestOrder = dbnote.latestOrder +1;
                    model.notes.update(dbnote, {where: {'id': dbnote.id}}).then(function(){
                        dbnote = utils.refineNotes(dbnote);
                        res.send({'success': true, 'note': dbnote});
                    });
                }).catch(function(err) {
                    console.log(err);
                    res.send({'success': false, 'message': 'internal server Error'});
                });
            }
        }
        else {
            res.status(403).end();
        }
    }).catch(function (err) {
        console.log(err);
        res.send({'success': false, 'message': 'internal server Error'});
    });
};

exports.logInUser = function (res, user) {
    if (user.email === undefined || user.email.length == 0) {
        res.send({success: false, 'message': 'Username Cannot be empty'});
    } else {
        model.User.findOne({where: {email: user.email}}).then(function (userDb) {
            if (userDb !== undefined && userDb != null) {
                var userFromDb = userDb.dataValues;
                var salt = userFromDb.salt;
                var passwordHash = utils.getPasswordHash(salt, user.password);
                if (passwordHash === userFromDb.passwordhash) {
                    utils.addUserSession(user.sessionId, userFromDb);
                    res.send({'success': true});
                    return;
                }
            }
            res.send({'success': false, 'message': 'Username/Password Combination is invalid'});
        }).catch(function (err) {
            console.log(err);
            res.send({'success': false, 'message': 'internal server Error'});
        });
    }
};

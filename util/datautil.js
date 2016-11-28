var model = require('./../model/model'),
    utils = require('./commonutils'),
    uuid = require('uuid');


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


exports.fetchnotes = function (res, sessionId) {
    var userDetails = utils.getUserDetails(sessionId);
    model.seq.query('SELECT L."id",L."noteId",L."version", L."subject",L."content",L."createdAt",L."updatedAt" ,L."userId" FROM notes L LEFT JOIN notes R ON  L."noteId" = R."noteId" AND  L."createdAt" < R."createdAt" WHERE R."noteId" IS NULL AND L."userId" = ?',
        { replacements : [userDetails.id], type : model.seq.QueryTypes.SELECT})
        .then(function(dbResults) {
            var noteList = [];
            for (var result in dbResults) {
                var noteInfo = dbResults[result];
                noteList.push(noteInfo);
            }
            res.send({'name': userDetails.name, 'noteList': noteList});
        }).catch(function (err) {
        console.log(err);
        res.send({'success': false, 'message': 'internal server Error'});
    });
};

exports.deletenote = function (res, sessionId, id) {
    var userDetails = utils.getUserDetails(sessionId);
    model.note.findOne({
        where: {id: id, userId: userDetails.id}
    }).then(function (dbnote) {
        if (dbnote) {
            var note = dbnote.dataValues;
            model.note.destroy({where: {'noteId': note.noteId, 'userId': note.userId}}).then(function () {
                res.send({'success': true});
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
    model.note.create({
        version: 1,
        noteId: uuid(),
        subject: subject,
        content: content,
        userId: userDetails.id
    }).then(function (note) {
        res.send({'success': true, 'note': note});
    }).catch(function (err) {
        console.log(err);
        res.send({'success': false, 'message': 'internal server Error'});
    });
};

exports.updatenote = function (res, sessionId, note, noteContent) {
    var userDetails = utils.getUserDetails(sessionId);
    model.note.find({
        where: {id: note.id, userId: userDetails.id}
    }).then(function (dbnote) {
        if (dbnote) {
            if (dbnote.content === noteContent) {
                res.send({'success': false, 'message': 'Nothing to update'});
            } else {
                model.note.build({content : noteContent, noteId : dbnote.noteId, subject : dbnote.subject, version : dbnote.version + 1, userId : userDetails.id}).save().then(function(newNote) {
                    res.send({'success': true, 'note': newNote});
                }).catch(function(error) {
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

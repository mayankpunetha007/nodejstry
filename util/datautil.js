var model = require('./../model/model');
var utils = require('./commonutils');

exports.addUser = function (sessionId, res, user) {
    model.User.findOne({
        where: {email: user.email}
    }).then(function (userDb) {
        if (userDb != null) {
            res.send({"success": false});
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
    });
};


exports.fetchnotes = function (res, sessionId) {
    var userDetails = utils.getUserDetails(sessionId);
    model.note.findAll({where: {userId: userDetails.id}}).then(function (dbResults) {
        var noteList = [];
        for (var result in dbResults) {
            var noteInfo = dbResults[result].dataValues;
            noteList.push(noteInfo);
        }
        res.send({'name': userDetails.name, 'noteList': noteList});
    });
};

exports.deletenote = function (res, sessionId, id) {
    var userDetails = utils.getUserDetails(sessionId);
    model.note.findOne({
        where: {id: id, userId: userDetails.id}
    }).then(function (dbnote) {
        if (dbnote) {
            var note = dbnote.dataValues;
            model.note.destroy({where: {'id': note.id, 'userId': note.userId}}).then(function () {
                res.send({'success': true});
            });
        }
        else {
            res.status({'success': false});
        }
    });
};

exports.addnote = function (res, sessionId, subject, content) {
    var userDetails = utils.getUserDetails(sessionId);
    model.note.create({
        version: 0,
        subject: subject,
        content: content,
        userId: userDetails.id
    }).then(function (note) {
        res.send({"success": true, "note": note});
    });
};

exports.updatenote = function (res, sessionId, noteId, noteContent) {
    var userDetails = utils.getUserDetails(sessionId);
    model.note.findOne({
        where: {id: noteId, userId: userDetails.id}
    }).then(function (dbnote) {
        if (dbnote) {
            var note = dbnote.dataValues;
            model.note.update({content: noteContent, version: note.version + 1},
                {where: {id: note.id}}).then(function (notes) {
                console.log(notes);
                note.content = noteContent;
                note.version = note.version + 1;
                res.send({'success': true, 'note': note});
            })
        }
        else {
            res.status(403);
        }
    });
};

exports.logInUser = function (res, user) {
    if (user.email === undefined) {
        res.send("{success:false}");
    } else {
        model.User.findOne({where: {email: user.email}}).then(function (userDb) {
            if (userDb !== undefined && userDb != null) {
                var userFromDb = userDb.dataValues;
                var salt = userFromDb.salt;
                var passwordHash = utils.getPasswordHash(salt, user.password);
                if (passwordHash === userFromDb.passwordhash) {
                    utils.addUser(user.sessionId, userFromDb);
                    res.send({"success": true});
                }
            }
            throw ("Username or Pass Invalid");
        }).catch(function (err) {
            console.log(err);
            res.send({"success": false});
        });
    }
};

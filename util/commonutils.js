var sha1 = require('sha1'),
    randomstring = require('randomstring');

exports.redirect = function (res, url) {
    res.redirect(url);
};

var activeUsers = {};

exports.addUserSession = function (sessionId, user) {
    activeUsers[sessionId] = user;
};

exports.isSessionActive = function (sessionId) {
    return activeUsers[sessionId] !== undefined;

};

exports.checkAuth = function (req, res, next) {
    if (exports.isSessionActive(req.session.id))
        next();
    else {
        res.writeHead(302, {
            'Location': '/index'
        });
    }
};


exports.refineSingleNote = function(noteInfo) {
    noteInfo['id'] = noteInfo['noteId'];
    delete noteInfo['noteId'];
    return noteInfo;

};

exports.refineNotes = function(noteInfo) {
    noteInfo['content'] = noteInfo['currentContent'];
    noteInfo['subject'] = noteInfo['currentSubject'];
    noteInfo['version'] = noteInfo['currentVersion'];
    delete noteInfo['order'];
    delete noteInfo['latestVersion'];
    delete noteInfo['latestOrder'];
    delete noteInfo['currentContent'];
    delete noteInfo['currentSubject'];
    delete noteInfo['currentVersion'];
    delete noteInfo['currentNoteId'];
    return noteInfo;

};


exports.getUserDetails = function (sessionId) {
    return activeUsers[sessionId];
};

exports.logoutSession = function (res, sessionId) {
    delete activeUsers[sessionId];
    res.send({success: true});
};

exports.getPasswordHash = function (salt, password) {
    return sha1(salt + password);
};

exports.servePage = function (res, file) {
    res.sendFile(file);
};


exports.generateRandomString = function (length) {
    return randomstring.generate({
        length: length,
        charset: 'alphabetic'
    });
};


var sha1 = require('sha1');
exports.redirect = function(res, url){
    res.redirect(url);
    res.end();
};

var activeUsers = {};

exports.addUser = function(sessionId, user){
    activeUsers[sessionId] = user;
};

exports.isSessionActive = function(sessionId) {
  return activeUsers[sessionId] !== undefined;

};

exports.checkAuth = function(req, res, next) {
    if (exports.isSessionActive(req.session.id))
        next();
    else {
        res.writeHead(302, {
            'Location': '/index'
        });
        res.end();
    }
};

exports.getUserDetails = function (sessionId) {
    return activeUsers[sessionId];
};

exports.logoutSession = function (res, sessionId) {
    delete activeUsers[sessionId];
    res.send({success:true});
    res.end();
};

exports.getPasswordHash =  function(salt, password) {
    return sha1(salt + password);
};

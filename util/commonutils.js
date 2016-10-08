exports.redirect = function(res, url){
    res.redirect(url)
    res.end();
};

var activeUsers = {};

exports.addUser = function(sessionId, user){
    activeUsers[sessionId] = user;
};

exports.isSessionActive = function(sessionId) {
  if(activeUsers[sessionId] !== undefined){
      return true;
  }
  return false;
};
var model = require('./../model/model');
var utils = require('./commonutils')

exports.addUser = function(sessionId, res, user){
    model.User.findOne({
        where: {email: user.email}
    }).then(function(userDb) {
        if(userDb!=null){
            res.send({"success":false});
            res.end();
        }else{
            model.User.create({
                    name: user.name,
                    email: user.email,
                    salt: user.salt,
                    passwordhash: user.passwordhash
            });
            utils.addUser(sessionId, user);
            res.send({"success":true});
            res.end();
        }
    });
};


exports.fetchUserInfo = function (sessionId, from, to, sortedBy) {
    var userDetails = utils.getUserDetails(sessionId);
    model.Task.finA
};



exports.logInUser = function(res, user){
    if(user.email === undefined) {
        res.send("{success:false}");
        res.end();
    }else{
        model.User.findOne({
            where: {email: user.body.email}
        }).then(function(userDb) {
            if(userDb !== undefined && userDb!=null ){
                var salt = userDb.salt;
                var passwordHash = util.getPasswordHash(salt, user.password);
                if(passwordHash === user.passwordhash){
                    utils.addUser(user.sessionId, user);
                    res.send({"success":true});
                    res.end;
                }
            }
            res.send({"success":false});
            res.end();
        });
    }
}

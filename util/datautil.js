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
            return res.send({"success":true});
        }
    });
};



exports.registerUser = function(res, user){
    if(user==null) {
        res.send("{error:false}");
        res.end();
    }else{


        res.send({"success":true,"name":user.name,"email":user.email});
        res.end();
    }
}

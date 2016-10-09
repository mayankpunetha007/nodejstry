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
            var passwordHash = utils.getPasswordHash(user.salt, user.pass);
            model.User.create({
                    name: user.name,
                    email: user.email,
                    salt: user.salt,
                    passwordhash: passwordHash
            });
            res.send({'success':true});
            res.end();
        }
    });
};


exports.fetchTasks = function (res, sessionId, from, to, sortedBy) {
    var userDetails = utils.getUserDetails(sessionId);
    model.Task.findAll({where:{ userId: userDetails.id}}).then(function(dbResults){
        taskList = [];
        for(result in dbResults){
            var taskInfo = dbResults[result].dataValues;
            taskList.push(taskInfo);
        }
        res.send({'name':userDetails.name, 'taskList':taskList});
        res.end();
    });
};

exports.addTask = function (res, sessionId, subject, content) {
    var userDetails = utils.getUserDetails(sessionId);
    model.Task.create({
        version:0,
        subject:subject,
        content:content,
        userId:userDetails.id
    });
    res.send({"success":true});
    res.end();
};

exports.updateTask = function(res, sessionId, taskId, taskContent){
    var userDetails = utils.getUserDetails(sessionId);
    model.Task.findOne({
        where: {id: taskId, userId:userDetails.id}
    }).then(function(dbTask) {
        if(dbTask){
            var task = dbTask.dataValues;
            model.Task.update({content: taskContent, version: task.version+1},
                { where: { id: task.id }}).then(function (tasks) {
                console.log(tasks);
                task.content = taskContent;
                task.version = task.version + 1;
                res.send({'success':true, 'task':task});
                res.end();
            })
        }
        else{
            res.status(403);
            res.end();
        }
    });
};

exports.logInUser = function(res, user){
    if(user.email === undefined) {
        res.send("{success:false}");
        res.end();
    }else{
        model.User.findOne({where: {email: user.email} }).then(function(userDb) {
            if(userDb !== undefined && userDb!=null ){
                userFromDb = userDb.dataValues;
                var salt = userFromDb.salt;
                var passwordHash = utils.getPasswordHash(salt, user.password);
                if(passwordHash === userFromDb.passwordhash){
                    utils.addUser(user.sessionId, userFromDb);
                    res.send({"success":true});
                    res.end();
                    return;
                }
            }
            throw ("Username or Pass Invalid");
        }).catch(function (err) {
            console.log(err);
            res.send({"success":false});
            res.end();
        });
    }
}

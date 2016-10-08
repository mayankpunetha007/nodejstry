var sha1 = require('sha1');
var randomstring = require("randomstring");
var fs = require('fs');

exports.servePage = function(res, file){
    res.sendfile(file);
}


exports.generateRandomString = function(length) {
    return randomstring.generate({
        length: length,
        charset: 'alphabetic'
    });
}



exports.getPasswordHash =  function(salt, password) {
    return sha1(salt + password);
}

var randomstring = require("randomstring");
var fs = require('fs');

exports.servePage = function(res, file){
    res.sendfile(file);
};


exports.generateRandomString = function(length) {
    return randomstring.generate({
        length: length,
        charset: 'alphabetic'
    });
};


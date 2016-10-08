var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var sha1 = require('sha1');
var model = require('./model/model')

var randomstring = require("randomstring");


function generateSalt() {
    return randomstring.generate({
        length: 128,
        charset: 'alphabetic'
    });
}

function getPasswordHash(salt, password) {
    return sha1(salt + password);
}


app.get('/*', function (req, res, next) {
    next();
});


app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

function isUserloggedIn(req) {
    if (req.session === undefined) {
        return false;
    }
    else if (req.session.auth === true) {
        return true;
    }
}

function checkAuth(req, res, next) {
    if (isUserloggedIn(req))
        next();
    else {
        res.writeHead(302, {
            'Location': '/index.html'
        });
        res.end();
    }

}


app.post('/register', function (req, res) {
    if (isUserloggedIn(req)) {
        res.writeHead(302, {
            'Location': '/home.html'
        });
    } else {
        var salt = generateSalt();
        model.User.create(
            {
                name: req.body.name,
                email: req.body.username,
                salt: salt,
                password: getPasswordHash(salt + req.body.password)
            });
        res.writeHead(res.writeHead(302, {
            'Location': '/home.html'
        }));
        res.end();
    }
});

app.get('/go', checkAuth, function (req, res) {
    res.send(JSON.stringify({'success': 'true'}));
    res.end();
});


app.listen(3000);


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var servingutil = require('./util/servingutil');
var datautil = require('./util/datautil');
var commonutils = require('./util/commonutils');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
app.use(morgan('dev'));

app.engine('html', require('ejs').renderFile);
app.use(cookieParser());
app.use(session({ secret: servingutil.generateRandomString(64),
    name: servingutil.generateRandomString(128),
    resave: true,
    saveUninitialized: true}));

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());



app.get("/", function(req, res){
    if(commonutils.isSessionActive(req.session.id))
        servingutil.servePage(res, './views/home.html');
    else
        servingutil.servePage(res, './views/index.html');
});

app.get("/index", function(req, res){
    if(commonutils.isSessionActive(req.session.id))
        servingutil.servePage(res, './views/home.html');
    else
        servingutil.servePage(res, './views/index.html');
});

app.get("/home", function(req, res){
    if(commonutils.isSessionActive(req.session.id))
        servingutil.servePage(res, './views/home.html');
    else
        servingutil.servePage(res, './views/index.html');
});

/**
 * Get all notes for currently logged in user
 */
app.get('/getnoteList', commonutils.checkAuth,  function (req, res) {
    if (commonutils.isSessionActive(req.session.id)) {
        datautil.fetchnotes(res, req.session.id, req.body.from);
    } else {
        res.writeHead(403);
        res.end();
    }
});

/**
 * Register a New User
 */
app.post('/register',  function (req, res) {
    if (commonutils.isSessionActive(req.session.id)) {
        commonutils.redirect(res, '/home');
    } else {
        var salt = servingutil.generateRandomString(128);
        var email = req.body.username;
        datautil.addUser(req.session.id, res, {'name': req.body.name, 'pass':req.body.password, 'salt':salt, 'email':email});
    }
});


app.post('/addnote', commonutils.checkAuth,  function (req, res) {
    if (commonutils.isSessionActive(req.session.id)) {
        datautil.addnote(res, req.session.id, req.body.subject, req.body.content);
    } else {
        res.writeHead(403);
        res.end();
    }
});

app.post('/updatenote', function (req, res) {
    if (commonutils.isSessionActive(req.session.id)) {
        datautil.updatenote(res, req.session.id, req.body.id, req.body.content);
    } else {
        res.writeHead(403);
        res.end();
    }
});


app.post('/logout', commonutils.checkAuth,  function (req, res) {
    commonutils.logoutSession(res, req.session.id);
});



app.post('/login', function (req, res) {
    if (commonutils.isSessionActive(req.session.id)) {
        res.writeHead(302, {
            'Location': '/home'
        });
    } else {
        datautil.logInUser(res, {'email':req.body.email,'password':req.body.password,'sessionId':req.session.id});
    }
});

app.post('/deletenote', function (req, res) {
    if (commonutils.isSessionActive(req.session.id)) {
        datautil.deletenote(res, req.session.id, req.body.id);
    } else {
        res.statusCode(403);
        res.end();
    }
});

app.listen(3000);




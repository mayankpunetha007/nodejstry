var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    datautil = require('./util/datautil'),
    commonutils = require('./util/commonutils'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan');

app.use(morgan('dev'));

app.engine('html', require('ejs').renderFile);
app.use(cookieParser());
app.use(session({
    secret: commonutils.generateRandomString(64),
    name: commonutils.generateRandomString(128),
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

var serveUrls = ['/', '/index', '/home'];

var allowedUrls = ['/login', '/register'];

/**
 * Middleware to check if user is authorized for url
 */
app.use('/*', function (req, res, next) {
    if (serveUrls.indexOf(req.originalUrl) > -1) {
        if (commonutils.isSessionActive(req.session.id))
            commonutils.servePage(res, __dirname + '/views/home.html');
        else
            commonutils.servePage(res, __dirname + '/views/index.html');
    }
    else if (allowedUrls.indexOf(req.originalUrl) > -1)
        next();
    else {
        if (commonutils.isSessionActive(req.session.id))
            next();
        else
            res.status(403).end();
    }
});

/**
 * Get all notes for currently logged in user
 */
app.get('/getnoteList', function (req, res) {
    datautil.fetchNotes(res, req.session.id);
});

/**
 * Register a New User
 */
app.post('/register', function (req, res) {
    if (commonutils.isSessionActive(req.session.id)) {
        commonutils.redirect(res, '/home');
    } else {
        var salt = commonutils.generateRandomString(128);
        var email = req.body.username;
        datautil.addUser(res, {
            'name': req.body.name,
            'pass': req.body.password,
            'salt': salt,
            'email': email
        });
    }
});

/**
 * Create a new note with empty content
 */
app.post('/addnote', function (req, res) {
    if (req.body.subject != null && req.body.subject.length == 0)
        res.send({'success': false, 'message': 'Cannot add an empty Subject'});
    else
        datautil.addnote(res, req.session.id, req.body.subject, req.body.content);
});

/**
 * Update the content of an existing note
 */
app.post('/updatenote', function (req, res) {
    datautil.updatenote(res, req.session.id, req.body.note, req.body.content);
});

/**
 * Undo from the current note
 */
app.post('/undo', function (req, res) {
    datautil.undo(res, req.session.id, req.body.note);
});

/**
 * Redo from the current note
 */
app.post('/redo', function (req, res) {
    datautil.redo(res, req.session.id, req.body.note);
});

/**
 * Logout the user by deleting user session
 */
app.post('/logout', function (req, res) {
    commonutils.logoutSession(res, req.session.id);
});

/**
 * Check user sent username and password and login the user
 */
app.post('/login', function (req, res) {
    if (commonutils.isSessionActive(req.session.id))
        res.writeHead(302, {'Location': '/home'});
    else
        datautil.logInUser(res, {
            'email': req.body.email,
            'password': req.body.password,
            'sessionId': req.session.id
        });
});

/**
 * Deletes a single task by id
 */
app.post('/deletenote', function (req, res) {
    datautil.deletenote(res, req.session.id, req.body.id);
});
app.listen(3000);

module.exports = app;





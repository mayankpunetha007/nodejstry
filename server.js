var express = require('express');
var app = express();
var bodyParser = require('body-parser')
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



app.get("/*", function(req, res){
    if(commonutils.isSessionActive(req.session.id))
        servingutil.servePage(res, './views/home.html');
    else
        servingutil.servePage(res, './views/index.html');
});

app.post('/register',  function (req, res) {
    if (commonutils.isSessionActive(req.session.id)) {
        commonutils.redirect(res, '/home');
    } else {
        var salt = servingutil.generateRandomString(128);
        var passwordHash = servingutil.getPasswordHash(salt, req.body.password)
        var email = req.body.username;
        datautil.addUser(req.session.id, res, {'name': req.body.name,'passwordhash': passwordHash, 'salt':salt, 'email':email});
    }
});


app.post('/login', function (req, res) {
    if (isUserloggedIn(req)) {
        res.writeHead(302, {
            'Location': '/home'
        });
    } else {
        model.User.findOne({
            where: {email: req.body.email}
        }).then(function(user) {
            console.log(user.salt);
            console.log(user.email);
            if(getPasswordHash(user.salt, req.body.password) == user.passwordhash){
                activeUsers[req.session.id] = user;
                res.send(user);
                res.end();
            }else{
                res.send("{success:false}")
            }
        })
    }
});

app.get('/go', servingutil.checkAuth, function (req, res) {
    res.send(JSON.stringify({'success': 'true'}));
    res.end();
});

app.listen(3000);




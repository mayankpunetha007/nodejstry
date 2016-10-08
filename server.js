var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

function checkAuth(req, res, next) {
    if(req.session === undefined){
        res.writeHead(302, {
            'Location': '/index.html'
        });
        res.end();
    }
    else if(req.session.auth === true){
        next()
    }

}


app.post('/register', function(req, res) {

    res.send(JSON.stringify({'success':'true'}));
});

app.get('/go', checkAuth, function(req, res) {
    res.send(JSON.stringify({'success':'true'}));
    res.end();
});

app.listen(3000);

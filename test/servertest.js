var model = require('./../model/model'),
    commonutils = require('./../util/commonutils'),
    server = require('./../server'),
    supertest = require('supertest'),
    should = require('should'),
    agent = supertest.agent(server);

describe('Test User operations', function () {

    var newUser = {
        name: 'Mayank Punetha',
        email: commonutils.generateRandomString(10),
        pass: commonutils.generateRandomString(12)
    };

    var anotherUser = {
        name: 'Mayank Punetha',
        email: commonutils.generateRandomString(10),
        pass: commonutils.generateRandomString(12)
    };

    var userNoteList = [];

    after(function (done) {
        model.User.destroy({where: {'email': newUser.email}}).then(function () {
            model.User.destroy({where: {'email': anotherUser.email}}).then(function () {
                done();
            });
        });


    });

    it('Try fetching Notes without login', function (done) {
        this.timeout(1000);
        agent.get('/getnoteList').then(function (res) {
            res.should.have.property('statusCode', 403);
            done();
        });
    });

    it('Register user', function (done) {
        agent.post('/register').send({
            'name': newUser.name,
            'password': newUser.pass,
            'username': newUser.email
        }).then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            done();
        });
    });

    it('Login User', function (done) {
        agent.post('/login').send({'password': newUser.pass, 'email': newUser.email}).then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            done();
        });
    });

    it('Logout User', function (done) {
        agent.post('/logout').then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            done();
        });
    });

    it('Try fetching Notes after logout', function (done) {
        agent.get('/getnoteList').then(function (res) {
            res.should.have.property('statusCode', 403);
            done();
        });
    });

    it('Re Login User', function (done) {
        agent.post('/login').send({'password': newUser.pass, 'email': newUser.email}).then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            done();
        });
    });

    it('Add note for the User', function (done) {
        agent.post('/addnote').send({
            'subject': 'This is a note',
            'content': 'This is the body for the note'
        }).then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            res.body.note.should.have.property('subject', 'This is a note');
            res.body.note.should.have.property('content', 'This is the body for the note');
            done();
        });
    });

    it('Add another note for new User', function (done) {
        agent.post('/addnote').send({
            'subject': 'This is another note',
            'content': 'This is the body for the another note'
        }).then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            res.body.note.should.have.property('subject', 'This is another note');
            res.body.note.should.have.property('content', 'This is the body for the another note');
            done();
        });
    });

    it('Fetch User Notes and check value', function (done) {
        agent.get('/getnoteList').then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('name', newUser.name);
            res.body.noteList[0].should.have.property('subject', 'This is a note');
            res.body.noteList[0].should.have.property('content', 'This is the body for the note');
            res.body.noteList[0].should.have.property('version', 0);
            userNoteList = res.body.noteList;
            done();
        });
    });

    it('Update the first Note', function (done) {
        agent.post('/updatenote').send({
            'id': userNoteList[0].id,
            'content': 'This is updated content'
        }).then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            res.body.note.should.have.property('subject', 'This is a note');
            res.body.note.should.have.property('content', 'This is updated content');
            res.body.note.should.have.property('version', 1);
            done();
        });
    });

    it('Delete the second Note', function (done) {
        agent.post('/deletenote').send({'id': userNoteList[1].id}).then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            done();
        });
    });


    it('Logout New User', function (done) {
        agent.post('/logout').then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            done();
        });
    });

    it('Register another user', function (done) {
        agent.post('/register').send({
            'name': anotherUser.name,
            'password': anotherUser.pass,
            'username': anotherUser.email
        }).then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            done();
        });
    });

    it('Login Another user', function (done) {
        agent.post('/login').send({'password': anotherUser.pass, 'email': anotherUser.email}).then(function (res) {
            res.should.have.property('statusCode', 200);
            res.body.should.have.property('success', true);
            done();
        });
    });

    it('Try to update new user content, Should result in forbidden', function (done) {
        agent.post('/updatenote').send({
            'id': userNoteList[0].id,
            'content': 'This is updated content From another user'
        }).then(function (res) {
            res.should.have.property('statusCode', 403);
            done();
        });
    });

    it('Try to delete new user content, Should result in forbidden', function (done) {
        agent.post('/deletenote').send({'id': userNoteList[0].id}).then(function (res) {
            res.should.have.property('statusCode', 403);
            done();
        });
    });

});
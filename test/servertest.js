var assert = require('assert');
var superagent = require('superagent');
var server = require('../server');
var users = require('../util/commonutils');
var status = require('http-status');

describe('/user', function () {
    var app;

    before(function () {
        app = server(3000);
    });

    after(function () {
        app.close();
    });

    it('returns username if name param is a valid user', function (done) {
        users.list = ['test'];
        superagent.get('http://localhost:3000/user/test').end(function (err, res) {
            assert.ifError(err);
            assert.equal(res.status, status.OK);
            var result = JSON.parse(res.text);
            assert.deepEqual({user: 'test'}, result);
            done();
        });
    });

    it('returns 404 if user named `params.name` not found', function (done) {
        users.list = ['test'];
        superagent.get('http://localhost:3000/user/notfound').end(function (err, res) {
            assert.ifError(err);
            assert.equal(res.status, status.NOT_FOUND);
            var result = JSON.parse(res.text);
            assert.deepEqual({error: 'Not Found'}, result);
            done();
        });
    });
});

describe('sequelize', function () {
    describe('User', function () {
        describe('#findOne');
        it('Should  send user error', function (done) {
            var user = new User('Luna');
            user.save(done);
        });
    });
});
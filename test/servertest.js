describe('sequelize', function() {
    describe('User', function() {
        describe('#findOne')
        it('should save without error', function(done) {
            var user = new User('Luna');
            user.save(done);
        });
    });
});
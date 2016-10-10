var sequelize = require('./model/model');
sequelize.seq.sync({force: true}).then(function () {
    console.log('It worked!  all Tables were created');
    process.exit();
}, function (err) {
    console.log('An error occurred while creating the table:', err);
});
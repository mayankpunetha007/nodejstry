Sequelize = require('sequelize');
var sequelize = new Sequelize('tasks', 'test', 'test123', {
    dialect: "postgres", // or 'sqlite', 'postgres', 'mariadb'
    port:    5432, // or 5432 (for postgres)
});


sequelize.authenticate().then(function(err) {console.log('Connection has been established successfully.');}, function (err) { console.log('Unable to connect to the database:', err);});

var User = sequelize.define('user', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        unique: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type:Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    salt:{
        type:Sequelize.STRING,
        allowNull: false
    },
    passwordhash:{
        type:Sequelize.STRING,
        allowNull: false
    }
});

var Task = sequelize.define('task', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    version:{
        type:Sequelize.INTEGER
    },
    subject:{
        type:Sequelize.STRING
    },
    content:{
        type:Sequelize.TEXT
    }
});

User.hasMany(Task, { onDelete: 'SET NULL', onUpdate: 'CASCADE' });

exports.Task = Task;
exports.User = User;

sequelize.sync({ force: true }).then(function(err) {console.log('It worked!');}, function (err) {console.log('An error occurred while creating the table:', err);});
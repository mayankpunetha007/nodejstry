var dbProps = require('./../package.json').dbProps,
    Sequelize = require('sequelize'),
    seq = new Sequelize(dbProps.db, dbProps.user, dbProps.pass, {
        dialect: dbProps.dialect,
        port: dbProps.port
});


seq.authenticate().then(function () {
    console.log('Database Connection has been established successfully.');
}, function (err) {
    console.log('Unable to connect to the database:', err);
});

var User = seq.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    passwordhash: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

var note = seq.define('note', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    noteId:{
        type: Sequelize.UUID,
    },
    version: {
        type: Sequelize.INTEGER
    },
    subject: {
        type: Sequelize.STRING
    },
    content: {
        type: Sequelize.TEXT
    }
});

User.hasMany(note, {onDelete: 'SET NULL', onUpdate: 'CASCADE'});

module.exports = {
    "note" : note,
    "User" : User,
    "seq" : seq
};

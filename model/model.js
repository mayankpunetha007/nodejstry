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

var notes = seq.define('notes', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    currentNoteId:{
        type: Sequelize.UUID,
    },
    currentVersion: {
        type: Sequelize.INTEGER
    },
    currentSubject: {
        type: Sequelize.STRING
    },
    currentContent: {
        type: Sequelize.TEXT
    },
    latestVersion: {
        type: Sequelize.INTEGER
    },
    order:{
        type: Sequelize.JSON
    },
    latestOrder:{
        type: Sequelize.INTEGER
    }
});

var singleNote = seq.define('singleNote', {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
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

User.hasMany(notes, {onDelete: 'SET NULL', onUpdate: 'CASCADE'});
notes.hasMany(singleNote, {onDelete: 'SET NULL', onUpdate: 'CASCADE'});

module.exports = {
    "singleNote" : singleNote,
    "User" : User,
    "notes" : notes,
    "seq" : seq
};

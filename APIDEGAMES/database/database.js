const sequilize = require('sequelize');

const connection = new sequilize('games', 'root', '2001', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection;
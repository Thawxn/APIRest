const { Sequelize } = require("sequelize");
const connection = require('./database');

const Game = connection.define('games', {
    title: {
        type: Sequelize.STRING,
        allNull: false
    },
    year: {
        type: Sequelize.STRING,
        allNull: false
    },
    price: {
        type: Sequelize.STRING,
        allNull: false
    }

});


module.exports = Game

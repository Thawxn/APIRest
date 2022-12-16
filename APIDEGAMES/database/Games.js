const { Sequelize } = require("sequelize");
const connection = require('./database');

const Game = connection.define('games', {
    title: {
        type: Sequelize.STRING,
        allNull: false
    },
    year: {
        type: Sequelize.NUMBER,
        allNull: false
    },
    price: {
        type: Sequelize.NUMBER,
        allNull: false
    }

});


module.exports = Game

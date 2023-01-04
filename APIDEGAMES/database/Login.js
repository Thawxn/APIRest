const { Sequelize } = require('sequelize');
const connection = require('./database');

const Login = connection.define('login', {
    email: {
        type: Sequelize.STRING,
        allNull: false
    },
    password: {
        type: Sequelize.STRING,
        allNull: false
    }
})


module.exports = Login;

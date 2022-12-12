const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const connection = require('./database/database');
const Game = require('./database/Games');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso');
    }).catch((erro) => {
        console.log(erro);
    });


app.get('/games', (req, res) => {
    Game.findAll().then(games => {
        res.statusCode = 200
        res.json(games)
    })
})


app.listen(3000, () => {
    console.log('Servidor funcionando com sucesso');
});
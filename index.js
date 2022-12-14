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


//Rota listagem de Games
app.get('/games', (req, res) => {
    Game.findAll().then(games => {
        res.statusCode = 200
        res.json(games)
    })
});

//Rota listagem de um game pelo id
app.get('/game/:id', (req, res) => {
    let id = req.params.id;

    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        Game.findOne({raw: true, where: {id}}).then(games => {
            if(games == null){
                res.sendStatus(404)
            }else{
                res.statusCode = 200
                res.json(games)
            }
        })
    }
});

//Rota para adicionar um game
app.post('/game', (req, res) => {
    let title = req.body.title;
    let year = req.body.year;
    let price = req.body.price;

    if(title == undefined || year == undefined || price == undefined){
        res.sendStatus(400)
    }else{
        Game.create({
            title: title,
            year: year,
            price: price
        }).then(() => {
            res.sendStatus(200)
        })
    }
});

//Rota para deletar um game
app.delete('/game/:id', (req, res) => {
    let id = req.params.id;

    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        Game.destroy({where: {id}}).then(() => {
            res.sendStatus(200)
        })
    }
});


app.listen(3000, () => {
    console.log('Servidor funcionando com sucesso');
});
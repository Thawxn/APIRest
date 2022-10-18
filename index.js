const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



var DB = {
    games: [

        {
            id: 23,
            title: 'Call of Duty MW',
            year: 2019,
            price: 60
        },
        {
            id: 18,
            title: 'Game Of Thrones',
            year: 2020,
            price: 70
        },
        {
            id: 16,
            title: 'The last of us',
            year: 2015,
            price: 80
        }
    ]
}

app.get('/games', (req,res) => {
    res.statusCode = 200
    res.json(DB.games)
})

app.get('/game/:id', (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    }else{
        
        var id = parseInt(req.params.id)

        var game = DB.games.find(g => g.id == id);

        if(game != undefined){
            res.statusCode = 200;
            res.json(game)
        }else{
            res.sendStatus(400)
        }



    }
})



app.listen(4000, () => {
    console.log('Servidor funcionando com sucesso!')
});
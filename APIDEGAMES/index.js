const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const connection = require('./database/database');
const Game = require('./database/Games');
const Login = require('./database/Login');


app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso');
    }).catch((erro) => {
        console.log(erro);
    });


//usando o token
const JWTSecret = 'afbasodalsdansdadnpafnan';

//middleware
function auth(req, res, next){
    const authToken = req.headers['authorization'];
    
    if(authToken != undefined){

        const bearer = authToken.split(' ');
        const token = bearer[1];

        jwt.verify(token,JWTSecret,(err, data) => {
            if(err){
                res.status(401);
                res.json({erro: 'token invalido.'})
            }else{
                req.token = token;
                req.loggedUser = { id: data.id, email: data.email }
                next()
            }
        })

    }else{
        res.status(401);
        res.json({erro: 'Token invalido.'})
    }
}



//Rota de cadastro de usuario
app.post('/create', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //autenticação para ver se não tem um email igual já cadastrado
    Login.findOne({ where: { email: email}}).then(login => {
        if(login == undefined){
            const salt = bcrypt.genSaltSync(8);
            const hash = bcrypt.hashSync(password, salt);

            //criando usuario
            Login.create({
                email: email,
                password: hash
            }).then(() => {
                return res.status(200).json({ email: true});
            }).catch((error) => {
                return res.status(400).json({error: 'Erro no cadastro de usuario'});
            })
        }
    })
});


//Rota de login do usuario
app.post('/autheticate', (req, res) => {
    const { email, password } = req.body;

    Login.findOne({ where: { email: email}}).then(login => {
        if(login != undefined){
            const correct = bcrypt.compareSync(password, login.password);
            if(correct){
                jwt.sign({id: login.id, email: login.email},JWTSecret,{expiresIn: '48h'},(err, token)=>{
                    if(err){
                        res.status(400)
                        res.json({err: 'falha interna.'})
                    }else{
                        res.json({
                            id: login.id,
                            email: email,
                            token
                        })
                    }
                })
            }else{
                return res.status(400).json({ erro: 'Email ou senha incorreta'})
            }
        }
    })
})


//Rota listagem de Games
app.get('/games', auth, (req, res) => {

    var HATEOAS = [
        {
            href: 'http://localhost:3000/games/0',
            method: 'DELETE',
            rel: 'delete_games'
        },
        {
            href: 'http://localhost:3000/games/0',
            method: 'GET',
            rel: 'get_games'
        },
        {
            href: 'http://localhost:3000/authenticate',
            method: 'POST',
            rel: 'login'
        },
    ]

    Game.findAll().then(games => {
        res.statusCode = 200
        res.json({games: games, _links: HATEOAS})
    })
});

//Rota listagem de um game pelo id
app.get('/game/:id', auth, (req, res) => {
    let id = req.params.id;

    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        var HATEOAS = [
            {
                href: 'http://localhost:3000/game/'+id,
                method: 'DELETE',
                rel: 'delete_game'
            },
            {
                href: 'http://localhost:3000/game/'+id,
                method: 'PUT',
                rel: 'edit_game'
            },
            {
                href: 'http://localhost:3000/game/'+id,
                method: 'GET',
                rel: 'get_games'
            },
            {
                href: 'http://localhost:3000/games',
                method: 'GET',
                rel: 'get_all_games'
            },
        ]

        Game.findOne({raw: true, where: {id}}).then(games => {
            if(games == null){
                res.sendStatus(404)
            }else{
                res.statusCode = 200
                res.json({games, _links: HATEOAS})
            }
        })
    }
});

//Rota para adicionar um game
app.post('/game', auth, (req, res) => {
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
app.delete('/game/:id', auth, (req, res) => {
    let id = req.params.id;

    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        Game.destroy({where: {id}}).then(() => {
            res.sendStatus(200)
        })
    }
});

//Rota para atualizar um jogo
app.put('/game/:id', (req, res) => {
    let id = req.params.id;
    let {title, year, price } = req.body;

    if(isNaN(id)){
        res.sendStatus(400)
    }else{
        Game.findOne({raw: true, where: {id}}).then(games => {
            if(games == null){
                res.sendStatus(400)
            }else{
                if(title != null){
                    Game.update({title}, {where: {id}})
                }

                if(year != null){
                    Game.update({year}, {where: {id}})
                }

                if(price != null){
                    Game.update({price}, {where: {id}})
                }
                res.sendStatus(200)
            }
        })
    }
});


app.listen(3000, () => {
    console.log('Servidor funcionando com sucesso');
});
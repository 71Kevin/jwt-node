const express = require('express');
const app = express();
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
let secret = 'uiuisegredo';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded

app.post('/login', (req, res) => {
    if(req.body.user === 'kevin' && req.body.password === 'q1w2e3'){
        const id = 1; // Suponhamos que esse id viria do banco
        let token = jwt.sign({ id }, secret, {
            expiresIn: 300 // Definindo que o token irá expirar em 5 minutos
        });
        res.status(200).send({ auth: true, token: token });
    } else {
        res.status(500).send('Login inválido!');
    }
});

function validateJwt(req, res, next){
    let token = req.headers['token'];
    if (!token) return res.status(401).send({ auth: false, message: 'Nenhum token informado.' });
    jwt.verify(token, secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Falha ao autenticar o token.' });
        req.userId = decoded.id;
        next();
    });
};

app.get('/user', validateJwt, (req, res) => {
    res.status(200).send('Token válido!');
});

app.listen(3000, () => {
    console.log('Rodando API na porta 3000');
});

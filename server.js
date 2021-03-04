const Clarifai = require('clarifai');

const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/resgister');
const signin = require('./controllers/signin');


const app2 = new Clarifai.App({apiKey: '59c54db7787e421893bf27988187d4c1'});

const handleApiCall = (req, res) => {
    app2.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to work with API'))
}


const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'postgres',
        password: 'teste',
      database: 'findface'
    },
  });


const app = express();

app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send(res.json(users));
})

app.post('/signin', (req, res) => { signin.handlerSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => { register.handlerRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id: id}).then(user => {
        if(user.length){
            res.json(user[0]);
        }
        else {
            res.status(400).json('Not found...User Id!!!');
        }
})
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    handleApiCall,
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Failed to get entries'));

})

app.post('/imageUrl', (req, res) => { handleApiCall(req, res) })

app.listen(process.env.PORT || 3000, () => {
    console.log('Runing on port ${process.env.PORT}');
})

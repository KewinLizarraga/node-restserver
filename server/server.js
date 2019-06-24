require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParse = require('body-parser');

// Parse application/x-www-form-urlencoded
app.use(bodyParse.urlencoded({ extended: false}));
// Parse application/json
app.use(bodyParse.json());

app.use(require('./routes/usuario'));

// Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/cafe', (err, res)=> {
    if (err) throw err;
    console.log('Base de datos ONLINE en en puerto: 27017');
});

app.listen(process.env.PORT, ()=> console.log(`Escuchando en el puerto: ${process.env.PORT}`));
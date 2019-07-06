require('./config/config');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

const bodyParse = require('body-parser');

// Parse application/x-www-form-urlencoded
app.use(bodyParse.urlencoded({ extended: false}));
// Parse application/json
app.use(bodyParse.json());

// Public
app.use(express.static(path.resolve(__dirname, '../public')))

// Configuración global de rutas
app.use(require('./routes/index'));

// Connecting to MongoDB
mongoose.connect(process.env.URLDB,
                {useNewUrlParser: true, useCreateIndex: true},
                (err, res)=> {
                    if (err) throw err;
                    console.log('Base de datos ONLINE en en puerto: 27017');
});

app.listen(process.env.PORT, ()=> console.log(`Escuchando en el puerto: ${process.env.PORT}`));
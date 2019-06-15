require('./config/config');

const express = require('express');
const bodyParse = require('body-parser');
const app = express();

// Parse application/x-www-form-urlencoded
app.use(bodyParse.urlencoded({ extended: false}));
// Parse application/json
app.use(bodyParse.json());



app.get('/usuario', (req, res)=> {
    res.json('get Usuario');
});
// POST --> para crear nuevos Registros
app.post('/usuario', (req, res)=> {
    let body = req.body;
    
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }

});
// PUT --> para actualizar los registros
app.put('/usuario/:idx', (req, res)=> {
    let id = req.params.idx;

    res.json({
        id
    });
});

app.delete('/usuario', (req, res)=> {
    res.json('delete Usuario');
});

app.listen(process.env.PORT, ()=> console.log(`Escuchando en el puerto ${process.env.PORT}`));
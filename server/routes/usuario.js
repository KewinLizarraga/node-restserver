const express = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const app = express();

app.get('/usuario', (req, res)=> {
    res.json('get Usuario');
});
// POST --> para crear nuevos Registros
app.post('/usuario', (req, res)=> {
    let body = req.body;
    
    // Crea una nueva instancia de ese esquema (esquema Usuario)
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })
    // Guardamos en la DB
    usuario.save((err, usuarioDB)=> {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null,

        // Regresamos todo el UsuarioDB para ver que paso
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
});
// PUT --> para actualizar los registros
app.put('/usuario/:idx', (req, res)=> {
    let id = req.params.idx;
    let body = req.body;

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB)=> {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});

app.delete('/usuario', (req, res)=> {
    res.json('delete Usuario');
});

module.exports = app;
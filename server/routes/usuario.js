const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken, (req, res)=> {
    // return res.json({
    //     usuario: req.usuario,
    //     name: req.usuario.nombre,
    //     mail: req.usuario.email
    // });

    let desde = req.query.desde || 0;
    desde = Number(desde);
    
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true}, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuario)=> {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({estado: true}, (err, conteo)=> {
                    res.json({
                        ok: true,
                        cuantos: conteo,
                        usuario
                    });
                });
            });
});
// POST --> para crear nuevos Registros
app.post('/usuario', [verificaToken, verificaAdmin_Role], (req, res)=> {
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
            });
        }

        // usuarioDB.password = null,

        // Regresamos todo el UsuarioDB para ver que paso
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });    
});
// PUT --> para actualizar los registros
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res)=> {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img','role','estado']);

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
// DELETE --> para eliminar los registros
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], (req, res)=> {
    let id = req.params.id;

    // Elimina el registro fisicamente en la DB
    // Usuario.findByIdAndRemove(id, (err, usuarioDel)=> {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioDel) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no es encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioDel
    //     });
    // });

    // Eliminar (cambiar el estado de true a false)
    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, {new: true}, (err, usuarioDel)=> {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        if (!usuarioDel) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no es encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDel
        })
    })
});

module.exports = app;
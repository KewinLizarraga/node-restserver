const express = require('express');
const _ = require('underscore');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

const app = express();

let Categoria = require('../models/categoria');


// =============================
// Mostrar todas las categorias
// =============================
app.get('/categoria', verificaToken, (req, res)=> {
    
    Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, categoria)=> {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    categoria
                });
            });
});
// =============================
// Mostrar una categoria por ID
// =============================
app.get('/categoria/:id', verificaToken, (req, res)=> {
    // Categoria.findById(...);
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
// =============================
// Crear una nueva categoria
// =============================
app.post('/categoria', verificaToken, (req, res)=> {
    // regresa nueva categoria
    // req.usuario._id
    let body = req.body;

    // Crea una nueva instanica (esquema Categoria)
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    // Guardar en la DB
    categoria.save((err, categoriaDB)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Retorna todo la categoriaDB
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
// =============================
// Actualizar una categoria
// =============================
app.put('/categoria/:id', verificaToken, (req, res)=> {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    
    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
// =============================
// Eliminar una categoria
// =============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res)=> {
    // solo un administrador puede borrar categorias
    // Categoria.findByIdAndRemove(...);
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDel)=> {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDel) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDel,
            message: 'Categoria ELIMINADA'
        });
    });
});

module.exports = app;
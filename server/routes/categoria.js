const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
let Categoria = require('../models/categoria');
const _ = require('underscore');
let app = express();


// ========================================
// Mostrar todas las categoría
// ========================================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        //.populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    cuantos: conteo
                });
            });
        });
});

// ========================================
// Mostrar una categoría por ID
// ========================================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById();
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
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
                    message: 'El ID no es correcto'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ========================================
// Crear nueva categoría
// ========================================
app.post('/categoria', verificaToken, (req, res) => {
    //regresa nueva categoría
    //req.usuario._id
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
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
                    message: 'El ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ========================================
// Actualizar categoría (nombre)
// ========================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    //let body = _.pick(req.body, ['descripcion']);
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
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
                    message: 'El ID no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ========================================
// Eliminación de categoría
// ========================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Solo un admin puede borrar categoría
    // Categoria.findByIdandRemove(..);
    let id = req.params.id;
    //Eliminación física:
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
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
                    message: 'El ID no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada,
            message: 'Categoría borrada'
        });
    });
});

module.exports = app;
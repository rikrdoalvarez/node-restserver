const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');
const app = express();

/**
 * @swagger
 * tags:
 *   name: usuario
 *   description: Usuarios de la aplicación
 */

/**
 * @swagger
 * path:
 *  /usuario:
 *    get:
 *      summary: Consulta de usuarios activos
 *      tags: [usuario]
 *      #parameters:
 *         # - in: query
 *           #   name: usuario
 *           #   schema:
 *           #       type: string
 *           #       enum: [approved, pending, closed, new]
 *           #       example: approved 
 *      responses: 
 *          '200':
 *              description: Usuarios activos
 *              content:
 *                  application/json:
 *                      example: 
 *                          ok: true
 *                          usuarios: 
 *                              _id: 5ea96bbf0381d906ff69e58e
 *                              nombre: Usuario de prueba
 *                              email: mail@mail.com
 *                              role: USER_ROLE
 *                              estado: true
 *                              google: false
 *                          cuantos: 1
 *          '400':
 *              description: Error
 *              content:
 *                  application/json:
 *                      example:
 *                          ok: false
 *                          err: Descripción del error
 *    post:
 *      summary: Crear nuevo usuario 
 *      tags: [usuario]
 *      responses: 
 *          '200':
 *              description: Usuario creado
 *              content:
 *                  application/json:
 *                      example: 
 *                          ok: true
 *                          usuarios: 
 *                              _id: 5ead39d101b0b3835e21dfcb
 *                              nombre: Usuario de prueba
 *                              email: mail@mail.com
 *                              role: USER_ROLE
 *                              estado: true
 *                              google: false
 *  /usuario{id}:
 *    put:
 *      summary: Actualizar usuario
 *      tags: [usuario]
 *      responses: 
 *          '200':
 *              description: Usuario actualizado
 *              content:
 *                  application/json:
 *                      example: 
 *                          ok: true
 *                          usuarios: 
 *                              _id: 5ead39d101b0b3835e21dfcb
 *                              nombre: Usuario de prueba
 *                              email: mail@mail.com
 *                              role: USER_ROLE
 *                              estado: true
 *                              google: false
 *    delete:
 *      summary: Eliminar usuario
 *      tags: [usuario]
 *      responses: 
 *          '200':
 *              description: Usuario eliminado
 *              content:
 *                  application/json:
 *                      example: 
 *                          ok: true
 *                          usuarios: 
 *                              _id: 5ead39d101b0b3835e21dfcb
 *                              nombre: Usuario de prueba
 *                              email: mail@mail.com
 *                              role: USER_ROLE
 *                              estado: true
 *                              google: false
 * 
 * 
 */
//  * 
//  *    post:
//  *      summary: Create a new user
//  *      tags: [usuario]
//  *      requestBody:
//  *        required: true
//  *        content:
//  *          application/json:
//  *            schema:
//  *              $ref: '#/server/schemas/User'
//  *      responses:
//  *        "200":
//  *          description: A user schema
//  *          content:
//  *            application/json:
//  *              schema:
//  *                $ref: '#/components/schemas/User'
//  */


app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });
        });
});

app.post('/usuario', [verificaToken, verificaAdminRole], (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.post('/usuarioAdm', (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: 'ADMIN_ROLE'
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //res.json('delete Usuario');
    let id = req.params.id;
    //Eliminación física:
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //Eliminación por cambio de estado
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});


module.exports = app;
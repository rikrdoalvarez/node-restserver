const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

/**
 * @swagger
 *  components:
 *    schemas:
 *      usuario:
 *        type: object
 *        required:
 *          - nombre
 *          - email
 *          - password
 *        properties:
 *          nombre:
 *            type: string
 *          email:
 *            type: string
 *            unique: true
 *          password:
 *            type: string
 *          img:
 *            type: string
 *          role:
 *            type: string
 *            default: 'USER_ROLE'
 *          estado:
 *            type: boolean
 *            default: true
 *          google:
 *            type: boolean
 *            default: false
 *        example:
 *           nombre: Nombre Usuario
 *           email: correo@email.com
 *           password: 123456
 *           img: imgString
 *           role: USER_ROLE
 *           estado: true
 *           google: false
 */

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },

});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema);
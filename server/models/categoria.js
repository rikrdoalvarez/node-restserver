const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// /**
//  * @swagger
//  *  components:
//  *    schemas:
//  *      categoria:
//  *        type: object
//  *        required:
//  *          - descripcion
//  *        properties:
//  *          descripcion:
//  *            type: string
//  *            unique: true
//  *          usuario:
//  *            type: Schema.Types.ObjectId
//  *        example:
//  *           descripcion: Nombre descripcion
//  *           usuario: Nombre usuario
//  */

let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Categoria', categoriaSchema);
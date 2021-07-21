const { Schema, model } = require('mongoose');

const ProveedorSchema = Schema({

    Nombre:{
        type: String,
        required: true
    },
    NIT: {
        type: String
    },
    Direccion: {
        type: String
    },
    Telefono:{
        type: String,
        required: true
    },
    Correo:{
        type: String
    },
    PersonaContacto: [],
    Estado:{
        type: Boolean,
        default: true
    },
    Empresa:{
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true
    }

}, { collection: 'proveedores' });

ProveedorSchema.method('toJSON', function() {
   const { __v, ...object } = this.toObject();
   return object;
});

module.exports = model('Proveedor', ProveedorSchema);
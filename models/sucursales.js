const {Schema, model} = require('mongoose');

const SucursalSchema = Schema({
    
    Empresa:{
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true
    },
    Nombre:{
        type: String,
        require: true
    },
    Direccion:{
        type: String,
        require: true
    },
    Telefono:{
        type: String
    },
    Estado:{
        type: Boolean,
        default: true
    }

}, {collection: 'sucursales'});

SucursalSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Sucursal', SucursalSchema);
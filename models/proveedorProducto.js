const { Schema, model } = require('mongoose');

const ProveedorProductoSchema = Schema({

    Producto:{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    Proveedor:{
        type: Schema.Types.ObjectId,
        ref: 'Proveedor',
        required: true
    }

});

ProveedorProductoSchema.method('toJSON', function () {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model('ProveedorProducto', ProveedorProductoSchema);
const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
      
    Empresa:{
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true
    },
    Nombre:{
        type: String,
        required: true
    },
    Codigo:{
        type: String,
        required: true
    },
    UnidadMedida:{
        type: String,
        required: true
    },
    ValorInterno:{
        type: Number,
        required: true
    },
    ValorPublico:{
        type: Number,
        required: true
    },
    ValorMayorista:{
        type: Number
    },
    StockMinimo:{
        type: Number
    },
    Estado: {
        type: Boolean,
        default: true
    }
});

ProductoSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Producto', ProductoSchema);
const {Schema, model} = require('mongoose');

const MovimientoSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    tipo:{
        type: String,
        required: true
    },
    arquetipoId:{
        type: String,
        required: true
    },
    fecha:{
        type: Date,
        default: new Date()
    },
    valor:{
        type: Number,
        required: true
    },
    quincena: {
        type: String,
        required: true
    },
    mes:{
        type: String,
        required: true
    },
    pago: {
        type: Boolean,
        default: false
    },
    uid:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
});

MovimientoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object; 
});

module.exports = model('Movimiento', MovimientoSchema);
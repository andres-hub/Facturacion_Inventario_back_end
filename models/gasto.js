const {Schema, model} = require('mongoose');

const GastoSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    tipo:{
        type: String,
        required: true
    },
    numeroCuotas:{
        type: String        
    },
    efectivoAnual:{
        type: String        
    },
    frecuencia: {
        type: String,
        required: true
    },   
    quincena: {
        type: String
    },
    valor: {
        type: String,
        required: true
    },
    uid:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado:{
        type: Boolean,
        required: true,
        default: true
    }
});

GastoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Gasto', GastoSchema);
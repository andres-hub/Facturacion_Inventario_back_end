const {Schema, model} = require('mongoose');

const ParametroSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    valor:{
        type: String,
        required: true
    },
    estado:{
        type: String,
        required: true,
        default: 'ACTIVO'
    }

});

ParametroSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Parametro', ParametroSchema);
const {Schema, model} = require('mongoose');

const ModuloSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    icono:{
        type: String,
        required: true
    },
    root:{
        type: Boolean,
        default: false
    }
});

ModuloSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Modulo', ModuloSchema);
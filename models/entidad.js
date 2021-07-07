const {Schema, model} = require('mongoose');

const EntidadSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    modulo: {
        type: Schema.Types.ObjectId,
        ref: 'Modulo',
        required: true
    },
    url:{
        type: String,
        required: true
    },
    acciones:[]

}, {collection: 'entidades'});

EntidadSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Entidad', EntidadSchema);
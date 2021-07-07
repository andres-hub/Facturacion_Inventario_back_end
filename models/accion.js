const {Schema, model} = require('mongoose');

const AccionSchema = Schema({

    accion:{
        type: String,
        required: true
    },
    alias:{
        type: String,
        required: true
    },
    check:{
        type:Boolean,
        default: false
    },
    url:{
        type: String,
        required: true
    },
    entidad: {
        type: Schema.Types.ObjectId,
        ref: 'Entidad',
        required: true
    },
    
}, {collection: 'acciones'});

AccionSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Accion', AccionSchema);
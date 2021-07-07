const {Schema, model} = require('mongoose');

const PermisoSchema = Schema({

    modulo: {
        type: Schema.Types.ObjectId,
        ref: 'Modulo',
        required: true
    },
    entidad: {
        type: Schema.Types.ObjectId,
        ref: 'entidad',
        required: true
    },
    accion:{
        type: String,
        required: true
    },
    asignado:{
        type: String,
        required: true
    }

});

PermisoSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Permiso', PermisoSchema);
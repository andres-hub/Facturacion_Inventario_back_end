const { Schema, model } = require('mongoose');

const ColaboradorSchema = Schema({

    Usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    Empresa:{
        type: Schema.Types.ObjectId,
        ref: 'Empresa',
        required: true
    },
    Estado:{
        type: Boolean,
        default: true
    },

}, { collection: 'colaboradores' });

ColaboradorSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

module.exports = model('Colaborador', ColaboradorSchema);
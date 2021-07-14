const {Schema, model} = require('mongoose');


const EmpresaSchema = Schema({

    Nombre:{
        type: String,
        required: true
    },
    Direccion:{
        type: String
    },
    NIT:{
        type: String
    },
    Telefono:{
        type: String
    },
    icono:{
        type: String
    },
    CEO: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },

});

EmpresaSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Empresa', EmpresaSchema);
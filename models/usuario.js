const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    role:{
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        default: '5fe247a381d3002e1002df33'   
    },
    google:{
        type: Boolean,
        required: true,
        default: false
    },
    estado:{
        type: Boolean,
        required: true,
        default: true
    }

});

UsuarioSchema.method('toJSON', function(){
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;   
});

module.exports = model('Usuario', UsuarioSchema);
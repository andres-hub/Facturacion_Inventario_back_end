const {Schema, model} = require('mongoose');

const RolSchema = Schema({
    nombre:{
        type: String,
        required: true
    }
}, {collection: 'roles'});

RolSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Rol', RolSchema);
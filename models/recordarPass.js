const {Schema, model} = require('mongoose');

const RecordarPassSchema = Schema({

    codigo:{
        type: String,
        required: true
    },
    uid:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    fecha:{
        type: Date,
        default: new Date()
    },
    estado:{
        type: Boolean,
        default: true
    }

}, {collection: 'recordarPass'});

RecordarPassSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('RecordarPass', RecordarPassSchema);
const {Schema, model} = require('mongoose');

const ArquetipoImgSchema = Schema({

    nombre:{
        type: String,
        required: true
    },
    estado:{
        type: String,
        required: true
    }
    
}, {collection: 'arquetiposImg'});

ArquetipoImgSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('ArquetipoImg', ArquetipoImgSchema);
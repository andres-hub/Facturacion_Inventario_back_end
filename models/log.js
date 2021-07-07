const {Schema, model} = require('mongoose');

const LogSchema = Schema({

    baseUrl:{
        type: String,
        required: true
    },
    method:{
        type: String,
        required: true
    },
    ip:{
        type: String,
        required: true
    },
    Data:{
        type: String
    },
    respuesta:{
        type: String,
        required: true
    },
    status:{
        type: String,
        default: '200'
    },
    uid:{
        type:String
    },
    fecha:{
        type:Date,
        default: new Date()
    }

});

LogSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    return object;   
});

module.exports = model('Log', LogSchema);
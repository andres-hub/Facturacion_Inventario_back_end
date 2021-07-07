const mongoose = require('mongoose');

const dbConnection = async () => {    
    try {
        
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        
        console.log("DB OnLine");
        
    } catch (error) {        
        throw new ('Error al iniciar la base de datos');
    }

}

module.exports = {
    dbConnection
}
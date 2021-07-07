const Usuario = require('../models/usuario');
const fs = require('fs');

const borarImagen = (paht)=>{

    if(fs.existsSync(paht)){
        fs.unlinkSync(paht);
    }  

}

const actualizarImagen = async(arquetipo, id, nombreArchivo) =>{

    let pathOld = '';

    switch (arquetipo) {
        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if(!usuario){
                return false;
            }

            //  TODO: validar si ya hay una imagen en firebase y borrarla
            pathOld = `./uploads/usuarios/${usuario.img}`;
            borarImagen(pathOld);
                  
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;

        default:
            return false;
    }    

}

module.exports = {
    actualizarImagen
}
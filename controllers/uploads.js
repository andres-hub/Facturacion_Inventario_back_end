const path = require('path');
const fs = require('fs');

const {response} = require('express');
const { v4: uuidv4 } = require('uuid');

const {actualizarImagen} = require("./actualizar-imagen");
const { validyty } = require("../helpers/validity-objectid");
const { guardarLog } = require("../helpers/guardar-Log");

const ArquetipoImg = require('../models/arquetipoImg');


const fileUpload = async(req, res = response) => {

    try {
        
        const id = req.query.id || req.uid;
        const validarId = await validyty(id);
        if(!validarId){
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req, id, msg, status);
            res.status(status).json({
                ok: false,
                msg
            });
        }
       
        const arquetipo = req.params.arquetipo;

        // TODO: crear servicio pra crud de la coleccion
        const arquetipoValidos = await ArquetipoImg.findOne({'nombre': arquetipo});
        
        if(!arquetipoValidos){
            const msg = 'Error arquetipo no valido';
            const status = 400;
            guardarLog(req, arquetipo, msg, status);
            return res.status(status).json({
                ok: false,
                error:{msg}
            });
        }        
        if (!req.files || Object.keys(req.files).length === 0) {
            const msg = 'Archivo guardado con éxito';
            const status = 400;
            guardarLog(req, '', msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const file = req.files.imagen;

        const nombreCortado = file.name.split('.');
        const extensionArchivo = nombreCortado[nombreCortado.length - 1];

        const extencionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

        if(!extencionesValidas.includes(extensionArchivo)){
            const msg = 'Error extensión de archivo no valida  no valida';
            const status = 400;
            guardarLog(req, extensionArchivo, msg, status);
            res.status(status).json({
                ok: false,
                msg
            });
        }

        const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

        const path = `./uploads/${arquetipo}/${nombreArchivo}`;
        const actulizardb = await actualizarImagen(arquetipo, id, nombreArchivo);
        if(!actulizardb){
            res.status(400).json({
                ok: false,
                msg: `El ${arquetipo} no se encontró en base de datos`
            });
        };

        // TODO: subir imagenes a firebase
        file.mv(path, (err) => {
            
            if(err){
                const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
                const status = 500;
                guardarLog(req, err, msg, status);
                return res.status(status).json({
                    ok: false,
                    msg
                });
            }
            
            const msg = "Archivo guardado con éxito";
            guardarLog(req, nombreArchivo, msg);
            res.json({
                ok: true,
                msg,
                nombreArchivo

            });
        });


    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, err, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

}

const retornarArchivo = (req, res = response) => {

    try {
        
        const arquetipo = req.params.arquetipo;
        const file = req.params.file;
    
        let pathArchivo = path.join(__dirname, `../uploads/${arquetipo}/${file}`);
        if(!fs.existsSync(pathArchivo)){
            pathArchivo = path.join(__dirname,`../uploads/no_imagen.jpg`);
           res.sendFile(pathArchivo);  
        }else
            res.sendFile(pathArchivo);

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

}

module.exports = {
    fileUpload,
    retornarArchivo
}
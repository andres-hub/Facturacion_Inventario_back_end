const {response} = require('express');
const jwt = require('jsonwebtoken');

const Parametro = require('../models/parametro');
const Accion = require('../models/accion');
const Permiso = require('../models/permiso');
const { guardarLog } = require('../helpers/guardar-Log');

const validarJWT = (req, res = response, next)=>{
    
    const token = req.header('x-token');

    if(!token){
        const msg = 'Token invalido';
        const status = 401;
        guardarLog(req,token, msg, status);
        return res.status(status).json({
            ok: false,
            msg
        });
    }

    try {

        const {uid, role} = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;
        req.role = role;
        
        next();

    } catch (error) {
        const msg = 'Token invalido';
        const status = 401;
        guardarLog(req, token, msg, status)
        return res.status(status).json({
            ok: false,
            msg
        });
    }
    
}

const validarAccion = async(req, res = response, next)=>{
    try {
       
        const superUser = await Parametro.findOne({ 'nombre' :'SUPE_USUARIO', 'valor': req.uid});

        if(!superUser){
            
            const accion = await Accion.findOne({'accion': req.accion});              
          
            if(!accion){

                const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
                const status = 404;
                guardarLog(req,'', msg, status);
                return res.status(status).json({
                   ok: false,
                   msg
                });
            }

            const permiso = await Permiso.findOne({'asignado': req.role, 'accion': accion._id});
            if(!permiso){
                const msg = 'Acceso denegado';
                const status = 400;
                guardarLog(req,msg, msg, status);
                return res.status(status).json({
                    ok: false,
                    msg 
                });
            }

        }
        
        next();

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req,error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

};

const validarJWTCambioPass = (req, res = response, next)=>{
    
    const token = req.header('x-token');

    if(!token){
        const msg = 'Token invalido';
        const status = 401;
        guardarLog(req,token, msg, status);
        return res.status(status).json({
            ok: false,
            msg
        });
    }

    try {

        const {email, role} = jwt.verify(token, process.env.JWT_SECRET);  
        req.email = email;      
        next();

    } catch (error) {
        const msg = 'Link invalido.';
        const status = 401;
        guardarLog(req, token, msg, status)
        return res.status(status).json({
            ok: false,
            msg
        });
    }
    
}


module.exports = {
    validarJWT,
    validarAccion,
    validarJWTCambioPass
}
const {response} = require('express');

const {validyty} = require('../helpers/validity-objectid');
const { guardarLog } = require('../helpers/guardar-Log');

const Rol = require('../models/rol');

const getRoles = async(req, res = response) =>{
    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        
        const [roles, total] = await Promise.all([
        
            Rol
                .find()
                .skip(desde)
                .limit(limite),
        
            Rol.countDocuments()
        
        ]);

        res.json({
            ok: true,
            roles,
            total
        });

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

};

const getRolesAll = async(req, res = response) =>{
    try {

        const roles = await Rol.find();

        res.json({
            ok: true,
            roles
        });

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

};

const getRolId = async(req, res = response) =>{
    try {

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){

            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req, id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });

        }

        const rol = await Rol.findById(id);

        if(!rol){

            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req, id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });

        }

        res.json({
            ok: true,
            rol
        });

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

};

const actualizarRol = async(req, res = response) =>{
    try {

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){
        
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req, id, msg, status);
            return res.status(400).json({
                ok: false,
                msg
            });
        
        }
        
        const rolDB = await Rol.findById(id);

        if(!rolDB){

            const msg = 'El rol no exite';
            const status = 400;
            guardarLog(req, '', msg, status);
            return res.status(400).json({
                ok: false,
                msg
            });

        }

        const cambios = {...req.body}

        const rol = await Rol.findByIdAndUpdate(id,cambios,{new:true});

        guardarLog(req, JSON.stringify(cambios),'ok');
        res.json({
            ok: true,
            rol
        });

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

};

const crearRol = async(req, res = response) =>{
    try {

        const rol = await new Rol(req.body);

        await rol.save();

        guardarLog(req, JSON.stringify(rol), 'ok');
        res.json({
            ok: true,
            rol
        });

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

};


module.exports = {
    getRolesAll,
    getRoles,
    getRolId,
    actualizarRol,
    crearRol   
}
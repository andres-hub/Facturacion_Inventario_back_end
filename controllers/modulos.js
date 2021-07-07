const {response} = require('express');

const Modulo = require('../models/modulo');


const { validyty } = require("../helpers/validity-objectid");
const { guardarLog } = require('../helpers/guardar-Log');
 
const getAllModulos = async(req, res = response) =>{
    try {

        const modulos = await Modulo.find();
        
        res.json({
            ok: true,
            modulos
        });

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

const getModulos = async(req, res = response) =>{

    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;

        const [modulos, total] = await Promise.all([

            Modulo
                .find()
                .skip(desde)
                .limit(limite),
            
            Modulo.countDocuments()

        ]);
        
        res.json({
            ok: true,
            modulos,
            total
        });
        
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

const buscarModulo = async(req, res = response) =>{

    try {
        
        const termino = req.params.termino;
        const regex    = new RegExp( termino, 'i' );
        
        const modulos = await Modulo.find({nombre: regex});

        res.json({
            ok: true,
            modulos,
            total: modulos.length
        });

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req,error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }
}

const getModuloId = async(req, res = response)=>{
    try {
        
        const id = req.params.id;
        const validarId = await validyty(id);
        if(!validarId){
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req,error, msg, status);
            return res.status(status).json({
                ok: false,
                msg 
            });
        }
        
        const modulo = await Modulo.findById(id);

        if(!modulo){
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        res.json({
            ok: true,
            modulo
        });
        
    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req,error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }
}

const crearModulo = async(req, res = response) =>{

    const modulo = new Modulo(req.body);

    try {
        
        await modulo.save();
        
        guardarLog(req,JSON.stringify(req.body), JSON.stringify(modulo) );
        res.json({
            ok: true,
            modulo
        });

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

const actualizarModulo = async(req, res = response) =>{

    try {

        const id = req.params.id;

        const moduloDB = await Modulo.findById(id);

        if(!moduloDB){
            return res.status(404).json({
                ok:false,
                msg: 'El modulo no existe'
            });
        }

        const cambios = {...req.body}

        const modulo = await Modulo.findByIdAndUpdate(id,cambios, {new:true});

        res.json({
            ok: true,
            modulo
        });
    
        
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

module.exports = {
    getAllModulos,
    getModulos,
    buscarModulo,
    getModuloId,
    crearModulo,
    actualizarModulo
}
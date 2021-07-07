const {response} = require('express');

const { validyty } = require('../helpers/validity-objectid');
const { guardarLog } = require('../helpers/guardar-Log');

const Parametro = require('../models/parametro');
const parametro = require('../models/parametro');

const getParametros = async(req, res = response) =>{
    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;

        const [parametros, total] = await Promise.all([

            Parametro
                .find()
                .skip(desde)
                .limit(limite),
            
            Parametro.countDocuments()

        ]);

        res.json({
            ok: true,
            parametros,
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

const buscarParametro = async(req, res = response) =>{
    try {

        const termino = req.params.termino;
        const regex    = new RegExp( termino, 'i' );
        
        const parametros = await Parametro.find({nombre: regex});

        res.json({
            ok: true,
            parametros,
            total: parametros.length
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

const getParametroId = async(req, res = response) =>{
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

        const parametro = await Parametro.findById(id);
        
        res.json({
            ok: true,
            parametro
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

const actualizarParametro = async(req, res = response) =>{
    try {

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){
        
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        
        const parametroDB = await Parametro.findById(id);

        if(!parametroDB){
            return res.status(404).json({
                ok:false,
                msg: 'El modulo no existe'
            });
        }

        const cambios = {...req.body};

        const parametro = await Parametro.findByIdAndUpdate(id, cambios, {new:true});

        guardarLog(req,JSON.stringify(cambios),JSON.stringify(parametro));
        res.json({
            ok: true,
            parametro
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

const crearParametro = async(req, res = response) =>{
    try {

        let body = req.body

        if(body.estado)
            body.estado = body.estado.toUpperCase();
        if(body.estado == null){
            body.estado = 'ACTIVO';
        }
        
        const parametro = new Parametro(body);

        await parametro.save();

        guardarLog(req,JSON.stringify(body), JSON.stringify(parametro));

        res.json({
            ok: true,
            parametro
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
    getParametros,
    getParametroId,
    buscarParametro,
    actualizarParametro,
    crearParametro
}
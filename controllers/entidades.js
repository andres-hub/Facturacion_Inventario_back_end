const {response} = require('express');

const { validyty } = require('../helpers/validity-objectid');
const { guardarLog } = require('../helpers/guardar-Log');

const Modulo = require('../models/modulo');
const Entidad = require('../models/entidad');
const Accion = require('../models/accion');

const getEntidades = async(req, res = response) =>{

    try {

        const id = req.params.id;        
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        
        const validarId = await validyty(id);
        if(!validarId){
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req,error, msg, status);
            return res.status(400).json({
                ok: false,
                msg
            });
        }
            
        const entidadesDB = await Entidad.find({modulo: id}).skip(desde).limit(limite);

        let entidades = [];

        await Promise.all(entidadesDB.map(async (entidad)=>{

            const {_id,nombre, url,modulo} = entidad;

            const acciones = await Accion.find({'entidad': _id});
            entidades.push({
                _id,
                nombre,
                url,
                modulo,
                acciones
            });

        }));

        res.json({
            ok: true,
            entidades,
            total: entidadesDB.length
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

const getBuscar = async(req, res = response) =>{
    
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

        const termino = req.params.termino;
        console.log(id);
        const regex = new RegExp( termino, 'i' );

        const entidades = await Entidad.find({modulo: id, nombre: regex});

        res.json({
            ok: true,
            entidades,
            total: entidades.length
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

const getEntidadId = async(req, res = response) =>{
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

        const entidadDB = await Entidad.findById(id);
        

        if(!entidadDB){
        
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req,error, msg, status);
            return res.status(status).json({
                ok: false,
                msg 
            });
        
        }

        const {_id,nombre, url,modulo} = entidadDB;

        const acciones = await Accion.find({'entidad': _id});

        res.json({
            ok: true,
            entidad:{
                _id,
                nombre,
                url,
                modulo,
                acciones
            }
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

const crearEntidad = async(req, res = response) =>{
    
    try {

        const body = req.body;
        const acciones = body.acciones;        

        let validarCampos = true;
        
        await Promise.all(acciones.map( x =>{
        
            if (!x.accion || !x.alias || !x.url){
                validarCampos = false;
                return;
            }
        
        }));
        
        if(!validarCampos){
            const msg = 'Datos incompletos';
            const status = 404;
            guardarLog(req,error, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const entidad = new Entidad(body);        
        
        const modulo = await Modulo.findById(body.modulo);
        
        if(!modulo){
            const msg = 'El modulo no es valido';
            const status = 404;
            guardarLog(req,msg, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        await entidad.save();

        Promise.all(acciones.map(async x =>{
        
            const accion = new Accion(x);
            accion.entidad = entidad._id;
            await  accion.save(); 
        
        }));
        
        guardarLog(req,JSON.stringify(body), JSON.stringify(entidad));
        res.json({
            ok: true,
            entidad: body
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

const actualizarEntidad = async(req, res = response) =>{

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

        const entidadDB = await Entidad.findById(id);
        
        if(!entidadDB){
            return res.status(404).json({
                ok:false,
                msg: 'La entidad no existe'
            });
        }

        const cambios = {...req.body}

        let validarCampos = true;
        
        
        await Promise.all(cambios.acciones.map( x =>{
            
            if (!x.accion || !x.alias || !x.url){
                validarCampos = false;
                return;
            }
        
        }));
        
        if(!validarCampos){
            const msg = 'Datos incompletos';
            const status = 404;
            guardarLog(req,error, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const entidad = await Entidad.findByIdAndUpdate(id,cambios, {new:true});

        Promise.all(cambios.acciones.map(async x =>{
            
            if(x._id){
                const accion = await Accion.findByIdAndUpdate(x._id, x);
            }else{
                const accion = new Accion(x);
                accion.entidad = entidad._id;
                await  accion.save(); 
            }

        }));        

        res.json({
            ok: true,
            entidad
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
    getEntidades,
    getBuscar,
    getEntidadId,
    crearEntidad,
    actualizarEntidad
}
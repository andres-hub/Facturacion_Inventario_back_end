const {response, json} = require('express');

const {validyty} = require('../helpers/validity-objectid');
const { guardarLog } = require('../helpers/guardar-Log');

const Entidad = require('../models/entidad');
const Modulo = require('../models/modulo');
const Permiso = require('../models/permiso');
const Parametro = require('../models/parametro');
const Accion = require('../models/accion');

const getPermisos = async(req, res = response) =>{
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

        const permisos = await Permiso.find({'asignado': id});
        
        res.json({
            ok: true,
            permisos
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

const getAcciones = async(req, res = response) =>{
    try {    

        
        const superUser = await   Parametro.findOne({ 'nombre' :'SUPE_USUARIO', 'valor':req.uid});

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
        
        const modulos = await Modulo.find();
        let menu = [];        

        await Promise.all(modulos.map(async (modulo)=>{

            var entidades = await Entidad.find({'modulo': modulo._id});
            if(!superUser){
                entidades = await Entidad.find({'modulo': modulo._id, 'root': false});;
            }

            await Promise.all(entidades.map(async (entidad)=>{

                const acciones = await Accion.find({'entidad': entidad._id});                

                await Promise.all(acciones.map(async (accion)=>{

                    const permiso = await Permiso.find({'accion': accion._id, 'asignado': id});
                    
                    if(permiso != null && permiso.length > 0 ){                        
                        accion.check = true;
                    }

                }));

                entidad.acciones = acciones;

            }));            
            
            menu.push({ modulo, entidades: entidades});

        }));

        res.json({
            ok: true,
            menu
        });

    } catch (error) {
        console.log(error);
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req,error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

};

const postPermisos = async(req, res = response) =>{
    try {

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){
        
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg: 'Error id no valido'
            });
        
        }

        const body = req.body;
        
        await Permiso.deleteMany({'asignado': id });

        await Promise.all(body.map( async (permiso)=>{    
            const {modulo, entidad, accion} = permiso;
            if(validyty(modulo) && validyty(entidad) && validyty(accion)){

                const _permiso = new Permiso({modulo,entidad, accion, asignado: id});
                await _permiso.save();

            }

        }));

       
        guardarLog(req,JSON.stringify(body), "ok");
        res.json({
            ok: true,
            body
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

const getVerificarRuta = async(req, res = response) =>{
    try {

        const superUser = await Parametro.findOne({ 'nombre' :'SUPE_USUARIO', 'valor': req.uid});
        if(superUser){           
            return res.json({
                ok: true           
            });
        }

        const ruta = await req.body.ruta;
        
        const accion = await Accion.findOne({'url': ruta}); 
       
        if(!accion){
            const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
            const status = 404;
            guardarLog(req,error, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const permiso = await Permiso.findOne({'asignado': req.role, 'accion': accion._id});

        if(!permiso){
            const msg = 'Acceso denegado';
            const status = 400;
            guardarLog(req,error, msg, status);
            return res.status(status).json({
                ok: false,
                msg 
            });
        }

        res.json({
            ok: true           
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
    getPermisos,
    getAcciones,
    getVerificarRuta,
    postPermisos
}
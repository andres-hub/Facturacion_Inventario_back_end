const { guardarLog } = require('../helpers/guardar-Log');
const { validyty } = require('../helpers/validity-objectid');

const Ingreso = require('../models/ingreso');

const crearIngreso = async(req, res = response) =>{
    try {

        let campos = req.body;
        campos.uid = req.uid;

        const ingreso = new Ingreso(campos);
        await ingreso.save();

        guardarLog(req,JSON.stringify(campos), JSON.stringify("Creado"));
        res.json({
            ok: true,
            ingreso
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

const getIngresos = async(req, res = response) =>{
    try {

        const ingresos = await Ingreso.find({'uid':req.uid, 'estado': true});
        
        res.json({
            ok: true,
            ingresos
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

const getIngreso = async(req, res = response) =>{
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

        const ingreso = await Ingreso.findOne({'_id': id, 'uid': req.uid});
        
        res.json({
            ok: true,
            ingreso
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

const actualizarIngreso = async(req, res = response) =>{
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

        const ingresoDB = await Ingreso.findById(id);

        if(!ingresoDB){
        
            const msg = 'Error id no valido';
            const status = 404;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        const cambios = {...req.body};
        const ingreso = await Ingreso.findByIdAndUpdate(id, cambios, {new: true});

        guardarLog(req, JSON.stringify(cambios), JSON.stringify(ingreso));
        res.json({
            ok: true,
            ingreso
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

const eliminarIngreso = async(req, res = response) =>{
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

        const ingreso = await Ingreso.findById(id);

        if(!ingreso){
        
            const msg = 'Error id no valido';
            const status = 404;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        ingreso.estado = false;
        await ingreso.save();

        guardarLog(req,id, JSON.stringify(ingreso));
        res.json({
            ok: true,
            ingreso
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
   crearIngreso,
   getIngresos,
   getIngreso,
   actualizarIngreso,
   eliminarIngreso
}
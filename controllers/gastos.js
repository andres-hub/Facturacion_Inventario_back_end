const { guardarLog } = require('../helpers/guardar-Log');
const { validyty } = require('../helpers/validity-objectid');

const Gasto = require('../models/gasto');

const getGastos = async(req, res = response) =>{
    try {
        
        const gastos = await Gasto.find({ 'uid': req.uid, estado: true });
       
        res.json({
            ok: true,
            gastos
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

const getGasto = async(req, res = response) =>{
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

        const gasto = await Gasto.findOne({'_id': id, 'uid': req.uid});

        if(!gasto){
        
            const msg = 'Error id no valido';
            const status = 404;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }
        
        res.json({
            ok: true,
            gasto
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

const crearGasto = async(req, res = response) =>{
    try {

        let campos = req.body;
        campos.uid = req.uid;
       
        const gasto = new Gasto(campos);

        await gasto.save();

        guardarLog(req,JSON.stringify(campos), JSON.stringify(gasto));
        res.json({
            ok: true,
            gasto
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

const actualizarGasto = async(req, res = response) =>{
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

        const gastoDB = await Gasto.findById(id);

        if(!gastoDB){
        
            const msg = 'Error id no valido';
            const status = 404;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        const cambios = {...req.body};
        const gasto = await Gasto.findByIdAndUpdate(id, cambios, {new: true});

        guardarLog(req, JSON.stringify(cambios), JSON.stringify(gasto));
        res.json({
            ok: true,
            gasto
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

const eliminarGasto = async(req, res = response) =>{
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

        const gasto = await Gasto.findById(id);

        if(!gasto){
        
            const msg = 'Error id no valido';
            const status = 404;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        gasto.estado = false;
        await gasto.save();

        guardarLog(req,id, JSON.stringify(gasto));
        res.json({
            ok: true,
            gasto
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
    crearGasto,
    getGastos,
    getGasto,
    actualizarGasto,
    eliminarGasto
 }
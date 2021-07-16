const {response} = require('express');

const { guardarLog } = require('../helpers/guardar-Log');
const { validyty } = require('../helpers/validity-objectid');

const Empresa = require('../models/empresa');
const Sucursal = require('../models/sucursales');

const getSucursales = async(req, res = response) =>{
    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 0;

        const empresa = await Empresa.findOne({'CEO': req.uid});

        if(!empresa){

            const msg = 'Aun no has registrado la empresa.';
            const status = 400;
            guardarLog(req, req.uid, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const [sucursales, total] = await Promise.all([

            Sucursal.find({'Empresa': empresa._id}).skip(desde).limit(limite),
            Sucursal.countDocuments()

        ]);

        res.json({
            ok: true,
            total,
            sucursales
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

const getSucursal = async(req, res = response) =>{
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

        const sucursal = await Sucursal.findById(id);

        if(!sucursal){
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
            sucursal
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

const postSucursal = async(req, res = response) =>{
    try {

        let body = req.body;
        
        const empresa = await Empresa.findOne({'CEO': req.uid});

        if(!empresa){

            const msg = 'Aun no has registrado la empresa.';
            const status = 400;
            guardarLog(req, id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        body.Empresa = empresa._id;

        const sucursal = await new Sucursal(body);

        await sucursal.save();
        
        guardarLog(req,JSON.stringify(sucursal), 'ok');

        res.json({
            ok: true,
            sucursal
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

const putSucursal = async(req, res = response) =>{
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

        const sucursalDB = await Sucursal.findById(id);
        if(!sucursalDB){
            const msg = 'La sucursal no exite';
            const status = 400;
            guardarLog(req, '', msg, status);
            return res.status(400).json({
                ok: false,
                msg
            });
        }

        const cambios = {...req.body};

        const sucursal = await Sucursal.findByIdAndUpdate(id,cambios, {new:true});
        guardarLog(req, JSON.stringify(cambios), 'Ok');

        res.json({
            ok: true,
            sucursal
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

const deleteSucursal = async(req, res = response) =>{
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

        const sucursalDB = await Sucursal.findById(id);

        if(!sucursalDB){

            const msg = 'La sucursal no exite';
            const status = 400;
            guardarLog(req, '', msg, status);
            return res.status(400).json({
                ok: false,
                msg
            });

        }

        const Estado = (sucursalDB.Estado)? false: true;
        const sucursal = await Sucursal.findByIdAndUpdate(id,{Estado}, {new: true});

        guardarLog(req, Estado, JSON.stringify(sucursal));
        res.json({
            ok: true,
            sucursal
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
    getSucursales,
    getSucursal,
    postSucursal,
    putSucursal,
    deleteSucursal
}
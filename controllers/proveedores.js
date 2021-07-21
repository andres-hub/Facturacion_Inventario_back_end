const { response } = require('express');

const { guardarLog } = require('../helpers/guardar-Log');
const { validyty } = require('../helpers/validity-objectid');

const Colaborador = require('../models/colaborador');
const Proveedor = require('../models/proveedor');

const getProveedores = async(req, res = response) =>{
    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 50;

        const colaborador = await Colaborador.findOne({'Usuario': req.uid});

        if(!colaborador){
            const msg = 'Aun no has registrado la empresa.';
            const status = 400;
            guardarLog(req, req.uid, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const [proveedores, total] = await Promise.all([
            Proveedor.find({'Empresa': colaborador.Empresa}).skip(desde).limit(limite),
            Proveedor.countDocuments()
        ])

        res.json({
            ok: true,
            total,
            proveedores
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

const getProveedor = async(req, res = response) =>{
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

        const colaborador = await Colaborador.findOne({'Usuario': req.uid});

        if(!colaborador){
            const msg = 'Aun no has registrado la empresa.';
            const status = 400;
            guardarLog(req, req.uid, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const proveedor = await Proveedor.findById(id);
       
        res.json({
            ok: true,
            proveedor
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

const postProveedor = async(req, res = response) =>{
    try {

        let body = req.body;

        const colaborador = await Colaborador.findOne({'Usuario': req.uid});

        if(!colaborador){
            const msg = 'Datos incompletos ';
            const status = 404;
            guardarLog(req,req.uid, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        body.Empresa = colaborador.Empresa;

        const proveedor = new Proveedor(body);

        await proveedor.save();

        guardarLog(req,JSON.stringify(body), JSON.stringify(proveedor));
        res.json({
            ok: true,
            proveedor
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

const putProveedor = async(req, res = response) =>{
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

        const proveedorDB = await Proveedor.findById(id);
        if(!proveedorDB){
            const msg = 'El proveedor no exite';
            const status = 400;
            guardarLog(req, '', msg, status);
            return res.status(400).json({
                ok: false,
                msg
            });
        }

        const cambios = {...req.body};
        const proveedor = await Proveedor.findByIdAndUpdate(id,cambios, {new:true});
        guardarLog(req, JSON.stringify(cambios), 'Ok');
        res.json({
            ok: true,
            proveedor
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
    getProveedores,
    getProveedor,
    postProveedor,
    putProveedor
}
const {response} = require('express');

const { guardarLog } = require('../helpers/guardar-Log');
const Empresa = require('../models/empresa');
const Colaborador = require('../models/colaborador');

const getEmpresa = async(req, res = response) =>{
    try {

        var empresa = await Empresa.findOne({'CEO': req.uid});
        if(req.superUser)
            empresa = await Empresa.find();
      
        res.json({
            ok: true,
            empresa
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

const crearEmpresa = async(req, res = response) =>{
    try {

        var empresa = await Empresa.findOne({'CEO': req.uid});

        if(!empresa){

            let body = req.body;
            body.CEO = req.uid;
            empresa = new Empresa(body);
            await empresa.save();
            
            const colaborador = new Colaborador({ Usuario: req.uid, Empresa: empresa._id});
            await colaborador.save();
            
        }

        const cambios = {...req.body};
        empresa = await Empresa.findByIdAndUpdate(empresa._id, cambios, {new: true});

        guardarLog(req, JSON.stringify(cambios), JSON.stringify(empresa));

        res.json({
            ok: true,
            empresa
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

module.exports = {
    getEmpresa,
    crearEmpresa
}
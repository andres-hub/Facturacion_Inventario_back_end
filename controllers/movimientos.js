const {response} = require('express');

const { validyty } = require("../helpers/validity-objectid");
const { guardarLog } = require('../helpers/guardar-Log');

const Ingreso = require('../models/ingreso');
const Movimiento = require('../models/movimiento'); 
const Gasto = require('../models/gasto');
const { Query } = require('mongoose');

const getQuincenas = async(req, res = response) =>{
    try {
       
        const desde = Number(req.query.desde) || 0;
        var _quincenas = [];
        const quincenas = await Movimiento.find().skip(desde);

        await Promise.all(quincenas.map(q =>{
            const {quincena, mes, fecha} = q;
             if(!_quincenas.find(m=> m.quincena === quincena && m.mes === mes)){
                let primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1);
                let ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);

                if(quincena === 'primera'){
                    ultimoDia.setDate(primerDia.getDate() + 14);
                }else{
                    primerDia.setDate(primerDia.getDate() + 14);
                }
                _quincenas.push({mes, quincena, primerDia, ultimoDia});
             }
        })); 
        
        await _quincenas.sort();
        await _quincenas.reverse();

        res.json({
            ok: true,
            _quincenas
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

const getMovimientos = async(req, res = response) =>{
    try {

        const tipo = req.params.tipo;
        const quincena = req.params.quincena;
        
        if(tipo != 'gastos' && tipo != 'ingresos' || quincena != 'segunda' && quincena != 'primera'){

            const msg = 'Datos no validos';
            const status = 404;
            guardarLog(req,`Tipo: ${tipo}, Quincena ${quincena} `, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });            

        }

        const date_ob = new Date();
        const month =  `${date_ob.getFullYear()}-${("0" + (date_ob.getMonth() + 1)).slice(-2)}`;
        if(tipo == 'ingresos'){

            const ingresos = await Ingreso.find({'uid':req.uid, 'estado': true});
            
            await Promise.all(ingresos.map(async (ingreso)=>{ 

                const movimiento = await Movimiento.findOne({'uid':req.uid, 'arquetipoId': ingreso._id, 'quincena': quincena, 'mes': month});
               
                if(!movimiento && ingreso.frecuencia == 'Mensual' && ingreso.quincena == quincena ){      
                    const _movimiento = new Movimiento();    
                    _movimiento.arquetipoId = ingreso._id;
                    _movimiento.nombre = ingreso.nombre;
                    _movimiento.valor = ingreso.valor;
                    _movimiento.uid = req.uid;
                    _movimiento.tipo = tipo;
                    _movimiento.quincena = quincena;
                    _movimiento.mes = month;
                    await _movimiento.save();
                }else if(!movimiento && ingreso.frecuencia != 'Mensual'){
                    const _movimiento = new Movimiento();    
                    _movimiento.arquetipoId = ingreso._id;
                    _movimiento.nombre = ingreso.nombre;
                    _movimiento.valor = ingreso.valor;
                    _movimiento.uid = req.uid;
                    _movimiento.tipo = tipo;
                    _movimiento.quincena = quincena;
                    _movimiento.mes = month;
                    await _movimiento.save();
                }

                if(ingreso.frecuencia == 'Ocasional'){
                    ingreso.estado = false;
                    ingreso.save();
                }
                if(movimiento && !movimiento.pago && movimiento.valor != ingreso.valor){
                    movimiento.valor = ingreso.valor;
                    movimiento.save();
                }

            }));

        }else{

            const gastos = await Gasto.find({'uid':req.uid, 'estado': true});

            await Promise.all(gastos.map(async (gasto)=>{

                const movimiento = await Movimiento.findOne({'uid':req.uid, 'arquetipoId': gasto._id, 'quincena': quincena, 'mes': month});

                if(!movimiento && gasto.frecuencia == 'Mensual' && gasto.quincena == quincena){      
                    const _movimiento = new Movimiento();    
                    _movimiento.arquetipoId = gasto._id;
                    _movimiento.nombre = gasto.nombre;
                    _movimiento.valor = gasto.valor;
                    _movimiento.uid = req.uid;
                    _movimiento.tipo = tipo;
                    _movimiento.quincena = quincena;
                    _movimiento.mes = month;
                    await _movimiento.save();
                }else if(!movimiento && gasto.frecuencia != 'Mensual'){
                    const _movimiento = new Movimiento();    
                    _movimiento.arquetipoId = gasto._id;
                    _movimiento.nombre = gasto.nombre;
                    _movimiento.valor = gasto.valor;
                    _movimiento.uid = req.uid;
                    _movimiento.tipo = tipo;
                    _movimiento.quincena = quincena;
                    _movimiento.mes = month;
                    await _movimiento.save();
                }

                if(gasto.frecuencia == 'Unica'){
                    gasto.estado = false;
                    gasto.save();
                }

                if(movimiento && !movimiento.pago && movimiento.valor != gasto.valor){
                    movimiento.valor = gasto.valor;
                    movimiento.save();
                }

            }));

        }

        const movimientos = await Movimiento.find({'uid':req.uid,'tipo': tipo, 'quincena': quincena, 'mes': month}); 
        
        res.json({
            ok: true,
            tipo,
            movimientos
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

const pagarMovimiento = async(req, res = response) =>{
    try {

        const id = req.params.id;
        const body = req.body;
        
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
        
        const movimiento = await Movimiento.findOne({'_id':id, 'uid': req.uid});      

        if(!movimiento){
        
            const msg = 'Error id no valido';
            const status = 404;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        movimiento.pago = true;
        movimiento.valor = body.valor;
        await movimiento.save();

        guardarLog(req,id, JSON.stringify(movimiento));
        res.json({
            ok: true,
            movimiento
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

const eliminarPago = async(req, res = response) =>{
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
        
        const movimiento = await Movimiento.findOne({'_id':id, 'uid': req.uid});        

        if(!movimiento){
        
            const msg = 'Error id no valido';
            const status = 404;
            guardarLog(req,id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        movimiento.pago = false;
        await movimiento.save();

        guardarLog(req,id, JSON.stringify(movimiento));
        res.json({
            ok: true,
            movimiento
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

const getMovimientosXQuincena = async(req, res = response) =>{
    try {
        
        const quincena = req.params.quincena;
        const mes = req.params.mes;
        const movimientos = await Movimiento.find({'quincena': quincena, 'mes': mes, 'uid': req.uid, 'pago': true});
        
        res.json({
            ok: true,
            movimientos
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
    getMovimientos,
    pagarMovimiento,
    eliminarPago,
    getQuincenas,
    getMovimientosXQuincena
}
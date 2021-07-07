/*
    Ruta: /api/gastos
*/


const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion} = require('../middlewares/validar-jwt');

const {crearGasto, getGastos, getGasto, actualizarGasto, eliminarGasto} = require('../controllers/gastos');


const router = Router();

router.get('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getGastos',next()},
        validarAccion
    ],
    getGastos
);

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getGastos',next()},
        validarAccion
    ],
    getGasto
);

router.post('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'crearGasto',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo es obligatorio').not().isEmpty(),
        check('frecuencia', 'La frecuencia es obligatoria').not().isEmpty(), 
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearGasto
);

router.put('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'actualizarGasto',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('tipo', 'El tipo es obligatorio').not().isEmpty(),
        check('frecuencia', 'La frecuencia es obligatoria').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarGasto
);

router.delete('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'eliminarGasto',next()},
        validarAccion,
    ],
    eliminarGasto
);

module.exports = router;
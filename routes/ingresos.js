/*
    Ruta: /api/ingresos
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion} = require('../middlewares/validar-jwt');

const { crearIngreso, getIngresos, getIngreso, actualizarIngreso, eliminarIngreso } = require('../controllers/ingresos');


const router = Router();

router.get('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getIngresos',next()},
        validarAccion
    ],
    getIngresos
)

router.get('/:id',
    [
        validarJWT,        
        (req, res, next)=>{req.accion = 'getIngresos',next()},
        validarAccion
    ],
    getIngreso
);

router.post('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'crearIngreso',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('frecuencia', 'La frecuencia es obligatoria').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearIngreso
);

router.put('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'actualizarIngreso',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('frecuencia', 'La frecuencia es obligatoria').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarIngreso
);

router.delete('/:id',
    [    
        validarJWT,
        (req, res, next)=>{req.accion = 'eliminarIngreso',next()},
        validarAccion
    ],
    eliminarIngreso
);

module.exports = router;
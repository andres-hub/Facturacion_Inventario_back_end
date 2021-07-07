/*
    Ruta: /api/parametros
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion} = require('../middlewares/validar-jwt');

const { getParametros, crearParametro, getParametroId, actualizarParametro, buscarParametro } = require('../controllers/parametros');

const router = Router();

router.get('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getParametros',next()},
        validarAccion
    ],
    getParametros
);

router.get('/buscar/:termino',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getParametros',next()},
        validarAccion
    ],
    buscarParametro
)

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getParametros',next()},
        validarAccion
    ],
    getParametroId
)

router.put('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'actualizarParametro',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        check('estado', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarParametro
)

router.post('/',
    [    
        validarJWT,
        (req, res, next)=>{req.accion = 'crearParametro',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearParametro
)

module.exports = router;
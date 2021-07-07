/*
    Ruta: /api/modulos
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion} = require('../middlewares/validar-jwt');

const { getAllModulos, getModulos,  buscarModulo, getModuloId, crearModulo, actualizarModulo} = require('../controllers/modulos');

const router = Router();

router.get('/all',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getAllModulos',next()},
        validarAccion
    ],
    getAllModulos
);

router.get('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getAllModulos',next()},
        validarAccion
    ],
    getModulos
);

router.get('/buscar/:termino',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getAllModulos',next()},
        validarAccion
    ],
    buscarModulo
);

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getAllModulos',next()},
        validarAccion
    ],
    getModuloId
)

router.post('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'crearModulo',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('icono', 'El icono es obligatorio').not().isEmpty(),
        validarCampos
    ]
    , crearModulo
);

router.put('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'actualizarModulo',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('icono', 'El icono es obligatorio').not().isEmpty(),
        validarCampos
    ]    
    , actualizarModulo
);



module.exports = router;

/*
    Ruta: /api/entidades
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion, addAction} = require('../middlewares/validar-jwt');

const {getEntidades, crearEntidad, actualizarEntidad, getBuscar, getEntidadId} = require('../controllers/entidades');

const router = Router();

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getEntidades',next()},
        validarAccion
    ],
    getEntidades
);

router.get('/:id/buscar/:termino',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getEntidades',next()},
        validarAccion
    ],
    getBuscar
);

router.get('/buscarId/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getEntidades',next()},
        validarAccion
    ],
    getEntidadId
)

router.post('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'crearEntidad',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('modulo', 'El modulo no es valido').isMongoId(),
        check('url', 'La url es obligatorio').not().isEmpty(),
        check('acciones', 'Las acciones son obligatorias').not().isEmpty(),
        validarCampos
    ],
    crearEntidad
);

router.put('/entidad/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'actualizarEntidad',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('modulo', 'El modulo no es valido').isMongoId(),
        check('url', 'La url es obligatorio').not().isEmpty(),
        check('acciones', 'Las acciones son obligatorias').not().isEmpty(),
        validarCampos
    ]    
    , actualizarEntidad
);

module.exports = router;

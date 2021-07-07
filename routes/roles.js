/*
    Ruta: /api/roles
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion} = require('../middlewares/validar-jwt');

const {getRoles, crearRol, getRolId, actualizarRol, getRolesAll} = require('../controllers/roles');
const validarJwt = require('../middlewares/validar-jwt');

const router = Router();

router.get('/all',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getRolesAll',next()},
        validarAccion
    ],
    getRolesAll
)

router.get('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getRolesAll',next()},
        validarAccion
    ],
    getRoles
);

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getRolesAll',next()},
        validarAccion
    ],
    getRolId
);

router.put('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'actualizarRol',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    actualizarRol
)

router.post('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'crearRol',next()},
        validarAccion,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearRol
);

module.exports = router;
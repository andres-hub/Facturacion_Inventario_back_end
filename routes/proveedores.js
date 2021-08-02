/*
    Ruta: /api/proveedores
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT, validarAccion, validarEmpresa } = require('../middlewares/validar-jwt');
const { postProveedor, getProveedores, getProveedor, putProveedor } = require('../controllers/proveedores');

const router = Router();

router.get('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getProveedores',next()},
        validarAccion,
        validarEmpresa
    ],
    getProveedores
);

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'postProveedor',next()},
        validarAccion,
        validarEmpresa
    ],
    getProveedor
);

router.post('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'postProveedor',next()},
        validarAccion,
        check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('Telefono', 'El teléfono es obligatorio').not().isEmpty(),
        validarCampos,
        validarEmpresa
    ],
    postProveedor
);

router.put('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'putProveedor',next()},
        validarAccion,
        check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('Telefono', 'El teléfono es obligatorio').not().isEmpty(),
        validarCampos,
        validarEmpresa
    ],
    putProveedor
)

module.exports = router;

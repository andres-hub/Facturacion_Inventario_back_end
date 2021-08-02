/*
    Ruta: /api/sucursales
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion, validarEmpresa} = require('../middlewares/validar-jwt');

const { getSucursales, getSucursal, postSucursal, putSucursal, deleteSucursal } = require('../controllers/sucursales');

const router = Router();

router.get('/', 
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getSucursales',next()},
        validarAccion,
        validarEmpresa
    ],
    getSucursales
);

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getSucursales',next()},
        validarAccion,
        validarEmpresa
    ],
    getSucursal
);

router.post('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'postSucursal',next()},
        validarAccion,
        check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('Direccion', 'La dirección es obligatoria').not().isEmpty(),
        validarCampos,
        validarEmpresa
    ],
    postSucursal
);

router.put('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'putSucursal',next()},
        validarAccion,
        check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('Direccion', 'La dirección es obligatoria').not().isEmpty(),
        validarCampos,
        validarEmpresa
    ],
    putSucursal
);

router.delete('/:id',
    [
        validarJWT, 
        (req, res, next)=>{req.accion = 'deleteSucursal',next()},
        validarAccion,
        validarEmpresa
    ],
    deleteSucursal
)

module.exports = router;
/*
    Ruta: /api/sucursales
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion} = require('../middlewares/validar-jwt');

const { getSucursales, getSucursal, postSucursal, putSucursal, deleteSucursal } = require('../controllers/sucursales');

const router = Router();

router.get('/', 
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getSucursales',next()},
        validarAccion
    ],
    getSucursales
);

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getSucursales',next()},
        validarAccion
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
        validarCampos
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
        validarCampos
    ],
    putSucursal
);

router.delete('/:id',
    [
        validarJWT, 
        (req, res, next)=>{req.accion = 'deleteSucursal',next()},
        validarAccion
    ],
    deleteSucursal
)

module.exports = router;
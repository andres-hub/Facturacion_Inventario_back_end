/*
    Ruta: /api/permisos
*/

const {Router} = require('express');
const {check} = require('express-validator');

const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion} = require('../middlewares/validar-jwt');

const { getPermisos, getAcciones, postPermisos, getVerificarRuta } = require('../controllers/permisos');

const router = Router();

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getPermisos',next()},
        validarAccion
    ],
    getPermisos
)

router.get('/acciones/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getPermisos',next()},
        validarAccion
    ],
    getAcciones
);

router.put('/ruta',
    [
        validarJWT,
        check('ruta', 'La ruta es obligatoria').not().isEmpty(),
        validarCampos
    ],
    getVerificarRuta
)

router.post('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'postPermisos',next()},
        validarAccion
    ],
    postPermisos    
)

module.exports = router;
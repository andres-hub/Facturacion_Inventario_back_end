/*
    Ruta: /api/movimientos
*/

const {Router} = require('express');

const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT,validarAccion} = require('../middlewares/validar-jwt');
const { getMovimientos, pagarMovimiento, eliminarPago, getQuincenas, getMovimientosXQuincena } = require('../controllers/movimientos');

const router = Router();

router.get('/quincenas',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getQuincenas',next()},
        validarAccion
    ],
    getQuincenas
)

router.get('/:tipo/:quincena',
    [        
        validarJWT,
        (req, res, next)=>{req.accion = 'getMovimientos',next()},
        validarAccion
    ],
    getMovimientos
);

router.get('/getMovimientosXQuincena/:mes/:quincena',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getMovimientosXQuincena',next()},
        validarAccion
    ],
    getMovimientosXQuincena
);

router.put('/:id',
    [   
        validarJWT,
        (req, res, next)=>{req.accion = 'pagarMovimiento',next()},
        validarAccion,
        check('valor', 'El valor es obligatorio').not().isEmpty(),
        validarCampos,
    ],
    pagarMovimiento
);

router.delete('/:id',
[
        validarJWT,
        (req, res, next)=>{req.accion = 'eliminarPago',next()},
        validarAccion
    ],
    eliminarPago
)

module.exports = router;
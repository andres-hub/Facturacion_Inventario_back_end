/*
    Ruta: /api/empresas
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');

const {validarJWT, validarAccion} = require('../middlewares/validar-jwt');

const {getEmpresa, crearEmpresa} = require('../controllers/empresas');


const router = Router();

router.get('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getEmpresas',next()},
        validarAccion
    ],
    getEmpresa
);

router.post('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getEmpresas',next()},
        validarAccion,
        check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearEmpresa
);

module.exports = router;
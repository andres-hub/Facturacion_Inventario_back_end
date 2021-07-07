/*
    Ruta: /api/login
*/

const {Router} = require('express');
const { check } = require('express-validator');
const {login, googleSingIn, renewToken, getCodigo, getValidarCambioPass, cambiarPass} = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos');
const { validarJWT, validarJWTCambioPass } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/',
    [
        check('email', 'El emial es obligatorio').isEmail(),
        // TODO: validar carecteres minimos del password
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ],
    login
)

router.post('/google',
    [
        check('token', 'El token de google es obligatorio').not().isEmpty(),
        validarCampos
    ],
    googleSingIn
)

router.get('/renew',
    validarJWT,
    renewToken
)


router.post('/codigo',
    [
        check('email', 'El emial es obligatorio').isEmail(),
        validarCampos
    ],
    getCodigo
)

router.get('/ValidarCambioPass',[validarJWTCambioPass], getValidarCambioPass)

router.put('/cambiarPass',
            [
                validarJWTCambioPass,
                check('pass', 'La contraseña es obligatoria').not().isEmpty(),
                validarCampos
            ],
            cambiarPass
)


module.exports = router;
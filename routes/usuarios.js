/*
    Ruta: /api/usuarios
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validarCampos} = require('../middlewares/validar-campos');
const {validarJWT, validarAccion} = require('../middlewares/validar-jwt');

const {getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario, buscarUsuario, actualizarRol} = require('../controllers/usuarios');

const router = Router();

router.get('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getUsuarios',next()},
        validarAccion
    ],
    getUsuarios
);

router.get('/buscar/:termino',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getUsuarios',next()},
        validarAccion
    ],
    buscarUsuario
);

router.post('/',
    [        
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El emial es obligatorio').isEmail(),  
        // TODO: validar carecteres minimos del password      
        check('password', 'La contraseña es obligatoria').not().isEmpty(),
        validarCampos
    ]
    , crearUsuario
);

router.put('/',
    [
        validarJWT,
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El correo no es valido').isEmail(),
        validarCampos
    ] 
    , actualizarUsuario
);

router.put('/role/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'actualizarRolUser',next()},
        validarAccion,
        check('role', 'El rol es obligatorio').not().isEmpty(),
        validarCampos
    ]    
    ,actualizarRol);

router.delete('/:id',
        [
            validarJWT,
            (req, res, next)=>{req.accion = 'borrarUsuario',next()},
            validarAccion,
        ]   
        , borrarUsuario);

module.exports = router;

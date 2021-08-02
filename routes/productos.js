/*
    Ruta: /api/productos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT, validarAccion, validarEmpresa } = require('../middlewares/validar-jwt');

const { getProductos, getProducto, postProducto, putProducto, deleteProducto } = require('../controllers/productos');

const router = Router();

router.get('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getProductos',next()},
        validarAccion,
        validarEmpresa
    ],
    getProductos
);

router.get('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'getProducto',next()},
        validarAccion,
        validarEmpresa
    ],
    getProducto
);

router.post('/',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'postProducto',next()},
        validarAccion,
        check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('Codigo', 'El código es obligatorio').not().isEmpty(),
        check('UnidadMedida', 'La unidad de medida es obligatoria').not().isEmpty(),
        check('ValorInterno', 'El valor interno es obligatorio').not().isEmpty(),
        check('ValorPublico', 'El valor publico es obligatorio').not().isEmpty(),
        check('Proveedores', 'El proveedor es obligatorio').not().isEmpty(),
        validarCampos,
        validarEmpresa
    ],
    postProducto
);

router.put('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'putProducto',next()},
        validarAccion,
        check('Nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('Codigo', 'El código es obligatorio').not().isEmpty(),
        check('UnidadMedida', 'La unidad de medida es obligatoria').not().isEmpty(),
        check('ValorInterno', 'El valor interno es obligatorio').not().isEmpty(),
        check('ValorPublico', 'El valor publico es obligatorio').not().isEmpty(),
        check('Proveedores', 'El proveedor es obligatorio').not().isEmpty(),
        validarCampos,
        validarEmpresa
    ],
    putProducto
)

router.delete('/:id',
    [
        validarJWT,
        (req, res, next)=>{req.accion = 'deleteProducto',next()},
        validarAccion,
        validarEmpresa
    ],
    deleteProducto
);

module.exports = router;
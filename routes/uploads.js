/*
    Ruta: /api/uploads/
*/

const {Router} = require('express');
const {validarJWT} = require('../middlewares/validar-jwt');

const { fileUpload, retornarArchivo } = require('../controllers/uploads');

const router = Router();
const expressFileUpload = require('express-fileupload');

router.use(expressFileUpload());

router.put('/:arquetipo',
    [
        validarJWT
    ]    
    , fileUpload
);

router.get('/:arquetipo/:file',
    retornarArchivo
);

module.exports = router;

const {response} = require('express');
const {validationResult} = require('express-validator');

const validarCampos = (req, res = response, next)=>{

    const errores = validationResult(req);

    if(!errores.isEmpty()){

        const errors =errores.mapped();
        let msg = "";
        for (const p in errors) {
            if(errors[p].msg)
                msg= errors[p].msg;
        }

        return res.status(400).json({
            ok: false,
            msg          
        });
    } 

    next();
       
}

module.exports = {
    validarCampos
}
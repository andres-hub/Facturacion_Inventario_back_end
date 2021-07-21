const {response} = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT, generarRecordarContraseñaJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
const { guardarLog } = require('../helpers/guardar-Log');
const { sendEmail } = require('../helpers/sendEmial');

const Usuario = require('../models/usuario');
const Parametro = require('../models/parametro');

const login = async(req, res = response)=>{

    try {
        
        const {email, password} = req.body;

        const usuarioDB = await Usuario.findOne({email});
       
        if(!usuarioDB){
            const msg = 'Usuario o contraseña no valida';
            const status = 400;
            guardarLog(req,JSON.stringify(req.body), msg, status);    
            return res.status(400).json({
                ok: false,
                msg
            });
        }

        if(!usuarioDB.estado){
            const msg = 'Error: Usuario inactivo.';
            const status = 400;
            guardarLog(req,JSON.stringify(req.body), msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuarioDB.password);

        if(!validPassword){
            const msg = 'Usuario o contraseña no valida';
            const status = 400;
            guardarLog(req,JSON.stringify(req.body), msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        req.uid = usuarioDB.id;

        const token = await generarJWT(usuarioDB.id, usuarioDB.role);
        
        req.superUser = false;
        guardarLog(req,email,`ok`);
        res.json({
            ok: true,
            token
        });
        
    } catch (error) {
         const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
         const status = 500;
         guardarLog(req,error, msg, status);
         res.status(status).json({
            ok: false,
            msg
        });
    }
}

const googleSingIn = async( req, res = response) => {

    try {

        const googleToken = req.body.token;
        const {name, email, picture} = await googleVerify(googleToken);

        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: ':)',
                img: picture,
                google: true
            });
        }else{

            if(!usuarioDB.estado){
                const msg = 'Error: Usuario inactivo.';
                const status = 400;
                guardarLog(req,error, msg, status);
                return res.status(status).json({
                    ok: false,
                    msg
                });
            }

            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();
        
        const token = await generarJWT(usuario.id, usuario.role);

        const menu = await getMenuFrontEnd(req,usuario.id);

        guardarLog(req,JSON.stringify(usuario),token );
        res.json({
            ok: true,
            token,
            menu
        });
        
    } catch (error) {
        const msg = 'El token no es correcto.';
        const status = 401;
        guardarLog(req,error, msg, status);
        res.status(401).json({
            ok: false,
            msg
        });
    }

}

const renewToken = async(req, res = response)=>{

    try {

        const uid = req.uid;
        const role = req.role;

        const token = await generarJWT(uid, role);

        const usuario = await Usuario.findById(uid);

        const superUser = await Parametro.findOne({ 'nombre' :'SUPE_USUARIO', 'valor': uid});

        if(superUser)
        {
            req.superUser = true;
        }

        const menu = await getMenuFrontEnd(req);
        
        res.json({
            ok: true,
            token,
            usuario,
            menu
        });
        
    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req,error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }


}

const getCodigo = async(req, res = response) =>{
    try {

        var email = req.body.email;
        
        const usuarioDB = await Usuario.findOne({email});
        
        if(!usuarioDB){
            const msg = 'Correo invalido por favor verifique el correo...';
            const status = 400;
            guardarLog(req,msg, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const token = await generarRecordarContraseñaJWT(usuarioDB.email, usuarioDB.role);

        const asunto = 'Recuperación de la contraseña';
        const text = `<div>
                        <p>Hemos enviado este correo electrónico ya que se ha solicitado la restauración de la clave</p>
                        <p>Para tu nueva contraseña, ingresa y cámbiala inmediatamente.
                        <a href="http://localhost:4200/cambio-pass/${token}">Ingrese aqui</a></p>
                        <p>Este link tiene de vigencia 15 minutos.</p>
                        <p>Gracias.</p>
                     </div>`;
        const enviarCorreo = await sendEmail(req, text, email, asunto);
        if(!enviarCorreo){
            
            return res.status(500).json({
                ok: enviarCorreo,
                msg: "Correo invalido por favor verifique el correo..."
            });
        }
        res.json({
            ok:enviarCorreo,
            msg: "Se envió un correo, para continuar siga las instrucciones."
        });

   

    } catch (error) {
       
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req,error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }
};

const getValidarCambioPass = async(req, res = response) =>{
    try {

        res.json({
            ok: true
        });

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req,error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

};

const cambiarPass = async(req, res = response) =>{
    try {

        const pass = req.body.pass;
        let user = await Usuario.findOne({'email': req.email});

        if(!user){
            const msg = 'Usuaro no valido.';
            const status = 404;
            guardarLog(req,req.email, msg, status);
            res.status(status).json({
                ok: false,
                msg
            });
        }

        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(pass, salt);

        await user.save();

        const token = await generarJWT(user.id);
        const menu = await getMenuFrontEnd(user.id);
        await guardarLog(req, pass, "ok");
        res.json({
            ok: true,
            token,
            menu
        });

    } catch (error) {
        console.log(error);
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req,error, msg, status);
        res.status(status).json({
            ok: false,
            msg
        });
    }

};

module.exports = {
    login,
    googleSingIn,
    renewToken,
    getCodigo,
    getValidarCambioPass,
    cambiarPass
}
const {response, json} = require('express');
const bcryptjs = require('bcryptjs');


const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
const Usuario = require('../models/usuario');
const Permiso = require('../models/permiso');
const { guardarLog } = require('../helpers/guardar-Log');

const getUsuarios = async(req, res)=>{

    try {

        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 10;
        
        const [usuarios, total] = await Promise.all([

            Usuario
                .find()
                .skip(desde)
                .limit(limite),
            
            Usuario.countDocuments()

        ]);
        
        res.json({
            ok: true,
            usuarios,
            total
        });    

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, error,msg,status);
        res.status(500).json({
            ok: false,
            msg
        });
    }
}

const crearUsuario = async(req, res = response)=>{

    try {

        const {email, password} = req.body;

        const exitsteEmail = await Usuario.findOne({email});

        if(exitsteEmail){
            const msg = 'El correo ya se encuentre registrado';
            const status = 400;
            guardarLog(req, email, msg, status);
            return res.status(400).json({
                ok:false,
                msg 
            });
        }

        const usuario = new Usuario(req.body);

        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(password, salt);

        await usuario.save();
        const token = await generarJWT(usuario.id);
        const menu = await getMenuFrontEnd(usuario.id);
        await guardarLog(req, email, "ok");
        res.json({
            ok: true,
            token,
            menu
        });
        
    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        
        guardarLog(req,error,msg, status);
        res.status(status).json({
            ok: false,
            msg
        });

    }

}

const actualizarUsuario = async(req, res = response)=>{    

    const uid = req.uid;
    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            const msg = 'El usuario no existe';
            const status = 404;
            guardarLog(req, uid, msg, status)
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const {password, google, role, estado, email, ...campos} = req.body;

        if( usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({email: email});
            if(existeEmail){
                const msg = 'El email ya existe';
                const status = 400;
                guardarLog(req, email, msg, status);
                return res.status(400).json({
                    ok: false,
                    msg
                });
            }
        }
        
        if(!usuarioDB.google)
            campos.email = email;
        else if(usuarioDB.email !== email){
            const msg = 'Los usuarios de google no pueden cambiar su correo';
            const status = 400;
            guardarLog(req,email, msg, status);
            return res.status(400).json({
                ok: false,
                msg
            });
        }


        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        guardarLog(req,JSON.stringify(campos), JSON.stringify(usuarioActualizado));
        res.json({
            ok: true,
            usuario: usuarioActualizado
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

const borrarUsuario = async(req, res = response)=>{

    const uid = req.params.id;

    try {
        
        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            const msg = 'El usuario no existe';
            const status = 500;
            guardarLog(req, uid, msg, status);
            return res.status(404).json({
                ok: false,
                msg
            });
        }

        const estado = (usuarioDB.estado)? false : true;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, {estado}, {new: true});

        guardarLog(req, estado, JSON.stringify(usuarioActualizado));
        res.json({
            ok: true,
            usuario: usuarioActualizado
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

const buscarUsuario = async(req, res = response) =>{
    try {
        
        const termino = req.params.termino;
        const regex    = new RegExp( termino, 'i' );
        
        const usuarios = await Usuario.find({nombre: regex, email: regex});

        res.json({
            ok: true,
            usuarios,
            total: usuarios.length
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

const actualizarRol = async(req, res = response)=>{
    
    try {

        const uid = req.params.id;
        const {role, ...campos} = req.body;
        const usuarioDB = await Usuario.findById(uid);
        
        if(!usuarioDB){
            const msg = 'El usuario no existe';
            const status = 404;
            guardarLog(req,uid, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        }
        
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, {role}, {new: true});

        usuarioActualizado.password = ':)';

        const permisos = await Permiso.find({'asignado': usuarioActualizado.role});
        
        // await Permiso.deleteMany({'asignado': uid });

        // await Promise.all(permisos.map( async (permiso)=>{    
            
        //     const {modulo, entidad, accion} = permiso;

        //     const _permiso = new Permiso({modulo,entidad, accion, asignado: uid});
        //     await _permiso.save(); 

        // }));

        res.json({
            ok: true,
            usuario: usuarioActualizado
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

module.exports ={
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario,
    buscarUsuario,
    actualizarRol
}
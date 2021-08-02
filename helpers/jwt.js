const jwt = require('jsonwebtoken');

const generarJWT = (uid, role, superUser, empresa)=>{

    return new Promise ((resolve, reject)=>{

        const payload = {
            uid,
            role,
            superUser,
            empresa
        };
    
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        }, (err, token)=>{
            if(err){
                reject('No se pudo generar el JWT');
            }
            resolve(token);
        });

    });
}

const generarRecordarContraseñaJWT = (email, role)=>{

    return new Promise ((resolve, reject)=>{

        const payload = {
            email,
            role
        };
    
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '15m'
        }, (err, token)=>{
            if(err){
                reject('No se pudo generar el JWT');
            }
            resolve(token);
        });

    });
}

module.exports = {
    generarJWT,
    generarRecordarContraseñaJWT
}
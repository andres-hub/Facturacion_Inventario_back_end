
var nodemailer = require('nodemailer');

const { guardarLog } = require('../helpers/guardar-Log');

const sendEmail = async(req, text, email, Asunto) =>{
    
    try {
       
        var mailOptions = {
            from: 'Remitente',
            to: email,
            subject: Asunto,
            html: text
        };

        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'walletapp1.0@gmail.com',
                pass: process.env.PASS_CORREO
            }
        });

        return new Promise((resolve, reject)=>{

            transporter.sendMail(mailOptions, function(error, info){
                console.log('enviado');
                if (error){
                    const msg = 'No se pudo enviar el correo';
                    const status = 500;
                    guardarLog(req,error, msg, status);
                    resolve(false);
                } 
                resolve(true);
            });

        });
        
    } catch (error) {  
        console.log(error);  
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, error, msg, status);
        return false;
    }    
    
};

module.exports = {
    sendEmail
}
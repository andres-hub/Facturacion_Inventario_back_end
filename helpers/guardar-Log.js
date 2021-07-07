const Log = require('../models/log');

const guardarLog = (req, Data, respuesta, status = 200) => {

    try {
        let ip = " ";
        if(!req.connection.remoteAddress){
            ip = req.connection.remoteAddress;
        }
        const log = new Log({
            baseUrl: req.baseUrl,
            method: req.method,
            ip: ip,
            Data,
            respuesta,
            status,
            uid: req.uid
        });

        log.save();

    } catch (error) {
       
    }

}

module.exports = {
    guardarLog
}
const Entidad = require("../models/entidad");
const Modulo = require("../models/modulo");
const Permiso = require("../models/permiso");
const Usuario = require("../models/usuario");
const Parametros = require("../models/parametro");
const { guardarLog } = require('../helpers/guardar-Log');

const  getMenuFrontEnd = async(req, uid) =>{
    const menu = [];
    try {

        const {role} = await Usuario.findById(uid);

        const superUser = await   Parametros.findOne({ 'nombre' :'SUPE_USUARIO', 'valor': uid});
        
        if(superUser){
            const modulos = await Modulo.find();
            
            await Promise.all(modulos.map(async (modulo)=>{

                const {nombre, icono, _id } = await modulo;

                const submenu = [];
                
                const entidades = await Entidad.find({'modulo': _id});
    
                await Promise.all(entidades.map(async (entidad)=>{
    
                    const {nombre, url} = await entidad;
    
                    submenu.push({
                        'titulo': nombre,
                        url
                    });
    
                }));

                menu.push({ 
                    'titulo': nombre,
                    icono,
                    submenu
                 });

            }));    
            
        }else{   
            
            const modulos = await Permiso.find({'asignado': role}).distinct('modulo'); 

            await Promise.all(modulos.map(async (modulo)=>{

                const {nombre, icono} = await Modulo.findById(modulo); 
                
                const submenu = [];
                
                const entidades = await Permiso.find({'asignado': role, 'modulo':modulo}).distinct('entidad');
    
                await Promise.all(entidades.map(async (entidad)=>{

                    const {nombre, url} = await Entidad.findById(entidad);
    
                    submenu.push({
                        'titulo': nombre,
                        url
                    });
    
                }));
    
                menu.push({ 
                    'titulo': nombre,
                    icono,
                    submenu
                 });
    
            }));

        }
        
        return menu;

    } catch (error) {
        const msg = 'Error inesperado... Comuníquese con el administrador del sistema';
        const status = 500;
        guardarLog(req, error, msg, status);
        return menu;
    }

};

module.exports = {
    getMenuFrontEnd
}
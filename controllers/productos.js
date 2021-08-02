const { response } = require('express');

const { guardarLog } = require('../helpers/guardar-Log');
const { validyty } = require('../helpers/validity-objectid');

const Producto = require('../models/producto');
const Proveedor = require('../models/proveedor');
const proveedorProducto = require('../models/proveedorProducto');
const ProveedorProducto = require('../models/proveedorProducto');

const getProductos = async(req, res = response) =>{
    try {
       
        const desde = Number(req.query.desde) || 0;
        const limite = Number(req.query.limite) || 50;

        const [productos, total] = await Promise.all([

            Producto.find({'Empresa': req.empresa}).skip(desde).limit(limite),
            Producto.find({'Empresa': req.empresa}).countDocuments()

        ]);

        res.json({
            ok: true,
            total,
            productos
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

const getProducto = async(req, res = response) =>{
    try {

        
        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){
        
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req, id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        const productoDB = await Producto.findById(id);

        if(!productoDB){
        
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req,msg, msg, status);
            return res.status(status).json({
                ok: false,
                msg 
            });
        
        }

        const {Estado, _id, Nombre, Codigo, UnidadMedida, ValorInterno, ValorPublico, Empresa} = productoDB;

        const ProveedoresDB = await ProveedorProducto.find({'Producto': productoDB._id}, 'Proveedor').populate('Proveedor', 'Nombre');
        const Proveedores = [];
        await ProveedoresDB.map(item=>{
            const { _id, Nombre} = item.Proveedor;
            Proveedores.push({_id, Nombre});
        }); 
        res.json({
            ok: true,
            producto:{
                Estado,
                _id,
                Nombre, 
                Codigo, 
                UnidadMedida, 
                ValorInterno, 
                ValorPublico,
                Empresa,
                Proveedores
            },
            
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

const postProducto = async(req, res = response) =>{
    try {

        let body = req.body;
        body.Empresa = req.empresa;
        let validarProveedor = true;

        await Promise.all(body.Proveedores.map( async row =>{
            
            const validarId = await validyty(row._id);
            if(!validarId){
                validarProveedor = false;
                return;
            }

            const proveedor = await Proveedor.find({'_id': row._id, 'Empresa': req.Empresa});
            if(!proveedor){
                validarProveedor = false;
                return;
            }

        }));
                
        if(!validarProveedor){
            const msg = 'Proveedor no valido';
            const status = 400;
            guardarLog(req,msg, msg, status);    
            return res.status(status).json({
                ok: false,
                msg
            });
        }

        const producto = new Producto(body);
        await producto.save();

        await Promise.all(body.Proveedores.map(async row =>{

            const proveedorProducto = new ProveedorProducto({'Proveedor': row._id, 'Producto': producto._id});

            await proveedorProducto.save();

        }));

        guardarLog(req,JSON.stringify(body),JSON.stringify(producto));
        res.json({
            ok: true,
            producto
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

const putProducto = async(req, res = response) =>{
    try {

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){
        
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req, id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        const productoDB = await Producto.findById(id)
        if(!productoDB){
        
            const msg = 'El producto no existe';
            const status = 404;
            guardarLog(req,'', msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        const cambios = {...req.body};
        
        const producto = await Producto.findByIdAndUpdate(id, cambios,{new:true});
        
        await ProveedorProducto.deleteMany({"Producto": id});

        await Promise.all(cambios.Proveedores.map(async row =>{

            const proveedorProducto = new ProveedorProducto({'Proveedor': row._id, 'Producto': producto._id});

            await proveedorProducto.save();

        }));

        guardarLog(req,JSON.stringify(cambios), 'Ok');
        res.json({
            ok: true,
            producto
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

const deleteProducto = async(req, res = response) =>{
    try {

        const id = req.params.id;
        
        const validarId = await validyty(id);
        if(!validarId){
        
            const msg = 'Error id no valido';
            const status = 400;
            guardarLog(req, id, msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }

        const productoDB = await Producto.findById(id);
        if(!productoDB){
        
            const msg = 'Error id no valido';
            const status = 404;
            guardarLog(req,'', msg, status);
            return res.status(status).json({
                ok: false,
                msg
            });
        
        }
        
        const Estado = (productoDB.Estado)? false: true;
        const producto = await Producto.findByIdAndUpdate(id,{Estado}, {new:true});        

        guardarLog(req,Estado, JSON.stringify(producto));
        res.json({
            ok: true,
            producto
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

module.exports = {
    getProductos,
    getProducto,
    postProducto,
    putProducto,
    deleteProducto
}
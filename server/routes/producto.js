const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autentificacion');

let app = express();
let Producto = require('../models/producto');

//-------------------------------
// Mostrar todas los productos
//-------------------------------
app.get('/productos', verificaToken,(req,res)=>{
    // trae todos los productos
    // populate: usuario y categoria
    //paginado
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
            .skip(desde)
            .limit(limite)
            .populate('categoria', 'descripcion')
            .populate('usuario', 'nombre email')
            .sort('nombre')
            .exec( (err,productos) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
                
                Producto.count({ estado: true }, (err, conteo) => {
                    res.json({
                        ok:true,
                        productos,
                        cuantos: conteo
                    });
                });
            });

});

//-------------------------------
// Mostrar un productos x ID
//-------------------------------
app.get('/productos/:id', (req,res)=>{
    // populate: usuario y categoria
    let id  =  req.params.id;

    Producto.findById(id)    
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err,productoDB) => {        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no ha sido encontrada'
                }
            });
        }
        
        res.json({
            ok: true,
            producto: productoDB
        });        

    });

});


//-------------------------------
// Buscar productos
//-------------------------------
app.get('/productos/buscar/:termino', verificaToken, (req, res)=>{
    
    let termino = req.params.termino;

    let regex = new RegExp(termino,'i');
    
    Producto.find({nombre: regex})
        .populate('categoria', 'nombre')
        .exec ((err, productos ) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });

        });
});

//-------------------------------
// Crear un productos
//-------------------------------
app.post('/producto', verificaToken, (req,res)=>{
    // grabar usuario
    // grabar categoria
    
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        //disponible: true
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save( (err, productoDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            producto: productoDB
        });
    }); 

});


//-------------------------------
//  Update un productos * CAmbia en el video 
//-------------------------------
app.put('/producto/:id', verificaToken, (req,res)=>{
    // grabar usuario
    // grabar categoria

    let id  =  req.params.id;
    let body = req.body;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        //disponible: true
        categoria: body.categoria,
        usuario: req.usuario._id
    };

    Producto.findByIdAndUpdate(id, producto, {new: true, runValidators: true}, (err, productoDB) => {
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: productoDB
        });
    });

});


//-------------------------------
//  Borrar un productos *Cambia en el video
//-------------------------------
app.delete('/producto/:id', verificaToken, (req,res)=>{
    // eliminacion logica disponible = false
    
    let id  =  req.params.id;
    let cambiaEstado = { disponible:false }

    Producto.findByIdAndUpdate( id, cambiaEstado, {new: true}, (err, productoBorrado) => {
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        
        if(!productoBorrado){
            return res.status(400).json({
                ok: false,
                err: { message: 'Producto no encontrado'}
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        });
    });

});


module.exports = app;

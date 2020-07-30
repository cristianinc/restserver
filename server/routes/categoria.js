const express = require('express');
let Categoria = require('../models/categoria');

const { model } = require('mongoose');

let { verificaAdmin_Role, verificaToken } = require('../middlewares/autentificacion');
const categoria = require('../models/categoria');

const app = express();


//-------------------------------
// Mostrar todas las categorias
//-------------------------------
app.get('/categoria', (req, res) => {
    
    Categoria.find({})
        .exec( (err,categoria) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            
            Categoria.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok:true,
                    categoria,
                    cuantos: conteo
                });
            });
        });
});

//-------------------------------
// Mostrar todas las categorias por ID
//-------------------------------
app.get('/categoria/:id', (req, res) => {

    let id  =  req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La Categoria no ha sido encontrada'
                }
            });
        }
        
        res.json({
            ok: true,
            categoria: categoriaDB
        });        

    });

});

//-------------------------------
// Crear una categorias
//-------------------------------
app.post('/categoria', verificaToken ,(req, res) => {
    //regresa la nueva categoria
    //idtoken

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) =>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null;

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });    

});

//-------------------------------
// Actualizar una categorias
//-------------------------------
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role] ,(req, res) => {
    //act nombre y descripcion

    let id  =  req.params.id;
    let body = req.body;

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

    
});

//-------------------------------
// Actualizar una categorias
//-------------------------------
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role] ,(req, res) => {
    //solo el administrador puede borrar fisica
    // //eliminacion fisica 

    let id = req.params.id;

    Categoria.findByIdAndRemove( id, (err, categoriaBorrado) =>{
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        };
        
        if(!categoriaBorrado){
            return res.status(400).json({
                ok: false,
                err: { message: 'Categoria no encontrado'}
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrado
        });
    });

    
});

module.exports = app;
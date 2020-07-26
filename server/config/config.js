//==========================================
//  Puerto
//==========================================

const { isArguments } = require("underscore");

process.env.PORT = process.env.PORT || 3000;


//==========================================
//  Entorno
//==========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==========================================
//  Base de datps
//==========================================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = 'mongodb+srv://cristianinc:carito@cluster0-rlyjz.gcp.mongodb.net/cafe';
}

process.env.URLDB = urlDB;
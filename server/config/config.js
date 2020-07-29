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
//  Base de datos
//==========================================

let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


//==========================================
//  Vencimiento Token
//==========================================
//60 seg * 60 min * 24 hrs * 30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 *24 *30;

//==========================================
//  SEED de autentificación
//==========================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//==========================================
//  Google Client ID
//==========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '543683223980-1frh0v5f91r4pscchmj2m2hgb7ekkr7r.apps.googleusercontent.com';


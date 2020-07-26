require('./config/config');
const express = require('express')
const mongoose = require('mongoose');

const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


app.use( require('./routes/usuario') );

mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false 
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function() {
  console.log('Conexion exitosa a moongose');
});


app.listen(process.env.PORT, () => {
  console.log('Escuhando Puerto: ', process.env.PORT);
});
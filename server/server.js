require('./config/config');//requiero el archivo que es el puerto prod y local

const express = require("express");
const mongoose = require('mongoose');
const app = express();

const bodyParser = require("body-parser");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/usuario')); //importamos los distintos metodos crud

//crear ruta a db
mongoose.connect(process.env.URLDB, (err, res) => {
  if(err) throw err;

  console.log('Base de datos ONLINE')
})

app.listen(process.env.PORT, () => {
  console.log("Escuchando el puerto");
});



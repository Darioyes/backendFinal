'use strict'

var mongoose = require('mongoose');
var app = require('./app');

mongoose.Promise = global.Promise;
var port = 3700;

mongoose.connect('mongodb://127.0.0.1:27017/portafolio').then(() => {
    console.log("Conexion a la base de datos establecida satisfactoriamente...");

    // Creacion del servidor
    app.listen(port, () => {
        console.log("Servidor corriendo correctamente en la url: localhost:3700");
    });

}).catch(err => console.log(err + " Error al conectar a la base de datos"));
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConexion } = require('./database/config');

// creamo e iniciamos el servidor de express
const app = express();

// Base de datos
dbConexion();

// Cors: no olvidar configurar la whitelist
app.use(cors());

// Rutas
app.get('/', (req, resp) => {
  resp.status(200).json({
    isSuccess: true,
    data: 'ok',
    message: 'Solicitud realizada con éxito',
  });
});

app.listen(process.env.PORT, () => {
  console.log('Express corriendo en el puerto ' + process.env.PORT);
});

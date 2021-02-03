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

// Middleware
// lectura y parseo del body, siempre ponerlo antes que las rutas
app.use(express.json());

// Rutas:
// Cambiaremos app.get('path', callback(req, res))  por app.use('path', archivo.js)
// para ello crearemos middlewares que nos permitan intersectar las rutas
// y cargar nuestros respectivos archivos de rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

app.listen(process.env.PORT, () => {
  console.log('Express corriendo en el puerto ' + process.env.PORT);
});

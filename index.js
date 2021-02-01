const express = require('express');

// creamo e iniciamos el servidor de express
const app = express();

app.listen(3000, () => {
  console.log('Express corriendo en el puerto 3000');
});

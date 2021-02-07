const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
// para poder construir un path
const path = require('path');
const fs = require('fs');

const uploadFile = async (req, res = response) => {
  const { tipo, id } = req.params;

  const tipoPermitidos = ['hospitales', 'medicos', 'usuarios'];

  if (!tipoPermitidos.includes(tipo)) {
    return res.status(400).json({
      isSuccess: false,
      message: 'no es un hospital, medicos, usuarios',
    });
  }

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      isSuccess: false,
      message: 'No hay archivo',
    });
  }

  // procesar la imagen
  const file = req.files.imagen;

  // extraemos la extension del archivo
  const arrNombre = file.name.split('.');
  const extension = arrNombre[arrNombre.length - 1];

  // validar extension
  const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
  if (!validExtensions.includes(extension)) {
    return res.status(400).json({
      isSuccess: false,
      message: 'extension de archivo no valida',
    });
  }

  // generamos el nombre del archivo
  const nombArchivo = `${uuidv4()}.${extension}`;
  // generamos el path
  const pathArchivo = `./uploads/${tipo}/${nombArchivo}`;

  await actualizarImagen(tipo, id, nombArchivo)
    .then((rpta) => {
      if (!rpta) {
        return res.status(400).json({
          isSuccess: false,
          message: 'usuario|hospital|medico tipo no encontrado',
        });
      } else {
        // movemos la imagen
        file.mv(pathArchivo, (err) => {
          if (err) {
            return res.status(500).json({
              isSuccess: false,
              message: 'Error al mover la imagen',
            });
          }

          res.status(200).json({
            isSuccess: true,
            message: `imagen: ${tipo} - subida correctamente`,
            nombArchivo,
          });
        });
      }
    })
    .catch((err) => console.log('Error al buscar el tipo'));
};

const mostrarImagen = (req, res = response) => {
  const { tipo, foto } = req.params;
  // __dirname = path de donde se ubica el archivo actual
  // Users/miguelchinchay/vscodeprojects/theme-admin-backend/controllers
  // por eso le regresamos con el ../
  let pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

  // verificamos si existe el path de la img
  if (fs.existsSync(pathImg)) {
    // devolver el archivo
    res.sendFile(pathImg);
  } else {
    pathImg = path.join(__dirname, '../uploads/no-img.jpg');
    res.sendFile(pathImg);
  }
};

module.exports = { uploadFile, mostrarImagen };

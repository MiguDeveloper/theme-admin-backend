const { response } = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');

const getTodo = async (req, res = response) => {
  const termino = req.params.termino;
  const regex = new RegExp(termino, 'i');

  const [usuarios, medicos, hospitales] = await Promise.all([
    Usuario.find({ nombre: regex }),
    Medico.find({ nombre: regex }),
    Hospital.find({ nombre: regex }),
  ]);

  res.status(200).json({
    isSuccess: true,
    usuarios,
    medicos,
    hospitales,
  });
};

const getDocumentosColeccion = async (req, res = response) => {
  const tabla = req.params.tabla;
  const termino = req.params.termino;
  const regex = new RegExp(termino, 'i');
  let data = [];

  try {
    switch (tabla) {
      case 'usuarios':
        data = await Usuario.find({ nombre: regex });
        break;
      case 'medicos':
        data = await Medico.find({ nombre: regex })
          .populate('usuario', 'nombre img')
          .populate('hospital', 'nombre img');
        break;
      case 'hospitales':
        data = await Hospital.find({ nombre: regex }).populate(
          'usuario',
          'nombre img'
        );
        break;
      default:
        return res.status(400).json({
          isSuccess: false,
          message: 'La busqueda es por usuario | medico | hospital',
        });
        break;
    }
    res.status(200).json({
      isSuccess: true,
      data,
      message: `Busqueda en ${tabla}, termino: ${termino}`,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: true,
      message: 'Error interno al momento de buscar coleccion',
    });
  }
};

module.exports = { getTodo, getDocumentosColeccion };

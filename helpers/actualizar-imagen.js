const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');
const fs = require('fs');

const actualizarImagen = async (tipo, id, nombArchivo) => {
  let pathViejo = '';

  switch (tipo) {
    case 'medicos':
      const medico = await Medico.findById(id);
      if (!medico) {
        return false;
      }
      pathViejo = `./uploads/medicos/${medico.img}`;
      borrarImagen(pathViejo);
      medico.img = nombArchivo;
      await medico.save();
      return true;
      break;
    case 'hospitales':
      {
        const hospital = await Hospital.findById(id);
        console.log(hospital);
        if (!hospital) {
          return false;
        }
        pathViejo = `./uploads/hospitales/${hospital.img}`;
        borrarImagen(pathViejo);
        hospital.img = nombArchivo;
        await hospital.save();
        return true;
      }
      break;
    case 'usuarios':
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return false;
      }
      pathViejo = `./uploads/usuarios/${usuario.img}`;
      borrarImagen(pathViejo);
      usuario.img = nombArchivo;
      await usuario.save();
      return true;
      break;
    default:
      return false;
      break;
  }
};

const borrarImagen = (pathArchivo) => {
  if (fs.existsSync(pathArchivo)) {
    fs.unlinkSync(pathArchivo);
  }
};

module.exports = { actualizarImagen };

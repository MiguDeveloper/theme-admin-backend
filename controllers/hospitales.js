const Hospital = require('../models/hospital');
const { response } = require('express');

const getHospitales = async (req, res = response) => {
  const hospitales = await Hospital.find().populate('usuario', 'nombre email');

  res.status(200).json({
    isSuccess: true,
    hospitales,
  });
};

const postHospital = async (req, res = response) => {
  const uid = req.uid;

  try {
    const hospital = new Hospital({ usuario: uid, ...req.body });
    const hospitalDb = await hospital.save();
    res.status(200).json({
      isSuccess: true,
      hospital: hospitalDb,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Problema interno al crear hospital',
    });
  }
};

const putHospital = async (req, res = response) => {
  const idHospital = req.params.id;
  const idUsuario = req.uid;

  try {
    const hospitalExists = await Hospital.findById(idHospital);
    if (!hospitalExists) {
      return res.status(404).json({
        isSuccess: false,
        message: 'Id de hospital no existe',
      });
    }

    const camposActualizar = { usuario: idUsuario, ...req.body };
    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      idHospital,
      camposActualizar,
      { new: true }
    );

    res.status(200).json({
      isSuccess: true,
      hospital: hospitalActualizado,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Error interno al momento de actualizar hospital',
    });
  }
};

const deleteHospital = async (req, res = response) => {
  const idHospital = req.params.id;

  try {
    const hospitalExists = await Hospital.findById(idHospital);
    if (!hospitalExists) {
      return res.status(404).json({
        isSuccess: false,
        message: 'Id de hospital no existe',
      });
    }

    await Hospital.findByIdAndDelete(idHospital);

    res.status(200).json({
      isSuccess: true,
      message: `Hospital ${hospitalExists.nombre} eliminado con exito`,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Error interno al eliminar hospital',
    });
  }
};

module.exports = { getHospitales, postHospital, putHospital, deleteHospital };

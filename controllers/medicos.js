const { response } = require('express');
const Medico = require('../models/medicos');

const getMedicos = async (req, res = response) => {
  try {
    const medicos = await Medico.find()
      .populate('usuario', 'nombre email')
      .populate('hospital', 'nombre img');

    res.status(200).json({
      isSuccess: true,
      medicos,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Error interno al obtener medicos',
    });
  }
};

const postMedico = async (req, res = response) => {
  const uid = req.uid;

  try {
    const medico = new Medico({ usuario: uid, ...req.body });
    const medicoDb = await medico.save();

    res.status(200).json({
      isSuccess: true,
      medico: medicoDb,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Error interno al crear usuario',
    });
  }
};

const putMedico = async (req, res = response) => {
  const uid = req.uid;
  const idMedico = req.params.id;

  try {
    const medicoExists = await Medico.findById(idMedico);
    if (!medicoExists) {
      return res.status(404).json({
        isSuccess: false,
        message: 'El medico con ese ID no existe',
      });
    }

    const camposActualizar = { usuario: uid, ...req.body };

    const medicoActualizado = await Medico.findByIdAndUpdate(
      idMedico,
      camposActualizar,
      { new: true }
    );

    res.status(200).json({
      isSuccess: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Error interno al momento de actualizar medico',
    });
  }
};

const deleteMedico = async (req, res = response) => {
  const idMedico = req.params.id;

  try {
    const medicoExists = await Medico.findById(idMedico);
    if (!medicoExists) {
      return res.status(404).json({
        isSuccess: false,
        message: 'El id de medico no existe',
      });
    }
    await Medico.findByIdAndDelete(idMedico);

    res.status(200).json({
      isSuccess: true,
      message: 'medico eliminado con exito',
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Error interno al eliminar medico',
    });
  }
};

const getMedicoById = async (req, res) => {
  const idMedico = req.params.id;

  try {
    const medicoExists = await Medico.findById(idMedico)
      .populate('usuario', 'nombre img')
      .populate('hospital', 'nombre img');

    if (!medicoExists) {
      return res.status(404).json({
        isSuccess: false,
        message: 'El id del medico no existe',
      });
    }

    res.status(200).json({
      isSuccess: true,
      medico: medicoExists,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Ocurrio un error interno al momento de obtener medico por id',
    });
  }
};

module.exports = {
  getMedicos,
  postMedico,
  putMedico,
  deleteMedico,
  getMedicoById,
};

const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJwt } = require('../helpers/jwt');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const usuarioDb = await Usuario.findOne({ email });

    if (!usuarioDb) {
      return res.status(404).json({
        isSuccess: false,
        message: 'Credenciales no validas',
      });
    }

    // verificar constrasenia
    const validPassword = bcrypt.compareSync(password, usuarioDb.password);
    if (!validPassword) {
      return res.status(400).json({
        isSuccess: false,
        message: 'password no valido',
      });
    }

    // Generar el JWT
    const token = await generarJwt(usuarioDb.id); //puede ser _id o id

    res.status(200).json({
      isSuccess: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      isSuccess: false,
      message: 'Error interno no se puede hacer login',
    });
  }
};

module.exports = { login };

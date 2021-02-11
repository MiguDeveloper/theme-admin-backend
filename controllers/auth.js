const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJwt } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const loginGoogle = async (req, res = response) => {
  const { token } = req.body;
  try {
    const { name, email, picture } = await googleVerify(token);

    const usuarioDb = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDb) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: '@@porDefaultGoogleUser@@',
        img: picture,
        google: true,
      });
    } else {
      // existe usuario
      usuario = usuarioDb;
      usuario.password = 'passExistente';
      usuario.google = true;
    }

    // guardar en base de datos
    await usuario.save();

    // generamos JWT
    const tokenInterno = await generarJwt(usuario.id);

    res.status(200).json({
      isSuccess: true,
      token: tokenInterno,
      message: 'google sign-in success',
    });
  } catch (error) {
    res.status(401).json({
      isSuccess: false,
      message: 'token no es correcto',
    });
  }
};

const renewToken = async (req, res = response) => {
  const { uid } = req;

  const usuario = await Usuario.findById(uid);
  const token = await generarJwt(uid);

  res.status(200).json({
    isSuccess: true,
    token,
    usuario,
  });
};

module.exports = { login, loginGoogle, renewToken };

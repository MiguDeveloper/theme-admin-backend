const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const usuario = require('../models/usuario');

const getUsuarios = async (req, res) => {
  // podemos filtrar el find tambien
  // Usuario.find({}, 'nombre email role')
  const usuarios = await Usuario.find();

  res.status(200).json({
    isSuccess: true,
    usuarios: usuarios,
  });
};

const postUsuario = async (req, res = response) => {
  const { password, email } = req.body;

  try {
    const emailExists = await Usuario.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        isSuccess: false,
        message: 'El correo ya existe',
      });
    }

    const usuario = new Usuario(req.body);

    // cifrar contrasenia
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    // ! Ojo: recordar que solo podemos usar us res.json
    // ! importante no devolver el usuario con sus campos sencibles, devolver token
    res.status(200).json({
      isSuccess: true,
      usuario,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Error al crear el usuario',
    });
  }
};

const putUsuario = async (req, res = response) => {
  // TODO: validar token y comprobar si el usuario es el correcto
  // Para atrapar el id que viene por el url
  //const uid = req.params.id;
  const { email, uid } = req.body;

  try {
    const userExists = await Usuario.findById(uid);
    if (!userExists) {
      res.status(404).json({
        isSuccess: false,
        response: 'no existe el usuario con ese ID',
      });
    }

    const campos = req.body;
    if (userExists.email === email) {
      delete campos.email;
    } else {
      const emailExists = await Usuario.findOne({ email: email });
      if (emailExists) {
        return res.status(400).json({
          isSuccess: false,
          message: 'el correo no valido ya existe',
        });
      }
    }

    // actualizamos
    delete campos.uid;
    delete campos.password;
    delete campos.google;

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {
      new: true,
    });

    res.status(201).json({
      isSuccess: true,
      usuarioActualizado,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Error al actualizar usuario',
    });
  }
};

module.exports = { getUsuarios, postUsuario, putUsuario };

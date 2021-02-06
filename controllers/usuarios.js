const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJwt } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  // podemos filtrar el find tambien: Usuario.find({}, 'nombre email role')
  // const usuarios = await Usuario.find().skip(desde).limit(5);
  // const totalReg = await Usuario.countDocuments();

  // * Optimizacion: Como ejemplo de realizar dos promesas de manera simultanea
  // * usaremos una sola promesa para resolver tanto el getUsuarios y el totalReg

  const [usuarios, totalReg] = await Promise.all([
    Usuario.find().skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);

  res.status(200).json({
    isSuccess: true,
    usuarios: usuarios,
    uid: req.uid, // solo a modo de ejemplo vemos que podemos pasar variables por el req
    total: totalReg,
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

    // * importante: podemos tbm obtener el ide del mismo objeto usuario.id sin necesidad
    // * de crear la constante 'userCreated'
    const userCreated = await usuario.save();

    // obtenemos el token
    const token = await generarJwt(userCreated.id);

    // * Ojo: recordar que solo podemos usar us res.json
    // * importante: no devolver el usuario con sus campos sencibles, devolver token
    res.status(200).json({
      isSuccess: true,
      usuario,
      token,
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
  const { email, uid, password, google, ...campos } = req.body;

  try {
    const userExists = await Usuario.findById(uid);
    if (!userExists) {
      return res.status(404).json({
        isSuccess: false,
        message: 'no existe el usuario con ese ID',
      });
    }

    if (userExists.email !== email) {
      const emailExists = await Usuario.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          isSuccess: false,
          message: 'el correo no valido ya existe',
        });
      }
    }

    // ponemos el parametro {new: true} para que nos devuelva el registro modificado
    campos.email = email;
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

const deleteUser = async (req, res = response) => {
  const uid = req.params.id;
  try {
    const userExists = await Usuario.findById(uid);
    if (!userExists) {
      return res.status(404).json({
        isSuccess: false,
        message: 'El usuario no existe',
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.status(200).json({
      isSuccess: true,
      message: 'Usuario eliminado',
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Error interno al momento de eliminar usuario',
    });
  }
};

module.exports = { getUsuarios, postUsuario, putUsuario, deleteUser };

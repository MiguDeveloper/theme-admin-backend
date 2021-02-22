const { response } = require('express');
const Usuario = require('../models/usuario');
const TypesRoles = require('../enums-types/types-roles');
const jwt = require('jsonwebtoken');

// middleware que se ejecuta con cada peticion 'req'
const validarJwt = (req, res = response, next) => {
  // leer el token
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      isSuccess: false,
      message: 'no hay token en la peticion',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    // entonces como se verifico el token, lo agregamos a el req
    req.uid = uid;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'token no valido',
    });
  }
};

const validarAdminRole = async (req, res, next) => {
  const uidCur = req.uid;
  const { uid } = req.body;

  try {
    const usuarioDb = await Usuario.findById(uidCur);
    if (!usuarioDb) {
      return res.status(404).json({
        isSuccess: false,
        message: 'Usuario no existe',
      });
    }

    if (usuarioDb.role !== 'ADMIN_ROLE') {
      if (uid !== uidCur) {
        return res.status(403).json({
          isSuccess: false,
          message: 'No tiene privilegios de acceso',
        });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      message: 'Hubo un error hable con el administrador',
    });
  }
};

module.exports = { validarJwt, validarAdminRole };

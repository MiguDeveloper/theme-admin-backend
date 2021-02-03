const { response } = require('express');
const jwt = require('jsonwebtoken');

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

module.exports = { validarJwt };

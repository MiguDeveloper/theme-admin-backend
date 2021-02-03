/*
 * path raiz:
 * api/usuarios
 */
const { Router } = require('express');
const {
  getUsuarios,
  postUsuario,
  putUsuario,
} = require('../controllers/usuarios');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

/*
 * Parametros =>('el path','los middleware', 'la funcion del controlador')
 *
 * Uso de la dependencia express-validator:
 * Para las validaciones usaremos los middlewares como segundo argumento
 * un [] o un simplemente la funcion si fuese uno solo.
 * Ahora en el metodo check('CAMPO', 'MENSAJE VALDACION PERSONALIZADO')
 *
 * Middleware personalizado: hemos creado un middleware que nos permite atrapar los errores
 * antes de que llegue al controlador y enviarlos al cliente mediante el 'resp'
 *
 * recordar que solo se manda la referencia al metodo del controlador: 'getUsuario', 'postUsuario'
 */
router.get('/', getUsuarios);
router.post(
  '/',
  [
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('password', 'El password es requerido').not().isEmpty(),
    check('email', 'El email es requerido').isEmail(),
    validarCampos,
  ],
  postUsuario
);
// Si deseo mandar el id en la Url: '/:id'
router.put(
  '/',
  [
    check('nombre', 'El nombre es requerido').not().isEmpty(),
    check('email', 'El email es requerido').isEmail(),
    check('role', 'El rol es requerido').not().isEmpty(),
    validarCampos,
  ],
  putUsuario
);

module.exports = router;

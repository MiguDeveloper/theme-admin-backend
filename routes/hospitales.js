// * Ruta base: /api/hospitales

const { Router } = require('express');
const { check } = require('express-validator');
const {
  getHospitales,
  postHospital,
  putHospital,
  deleteHospital,
} = require('../controllers/hospitales');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJwt], getHospitales);
router.post(
  '/',
  [
    validarJwt,
    check('nombre', 'El nombre del hospital es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  postHospital
);
router.put(
  '/:id',
  [check('nombre', 'El nombre del hospital es requerido'), validarJwt],
  putHospital
),
  router.delete(
    '/:id',
    [check('nombre', 'El nombre del hospital es requerido'), validarJwt],
    deleteHospital
  );

module.exports = router;

// * Ruta raiz: /api/medicos

const { Router } = require('express');
const { check } = require('express-validator');
const {
  getMedicos,
  postMedico,
  putMedico,
  deleteMedico,
  getMedicoById,
} = require('../controllers/medicos');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJwt } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', [validarJwt], getMedicos);
router.post(
  '/',
  [
    validarJwt,
    check('nombre', 'El nombre del medico es requerido').not().isEmpty(),
    check('hospital', 'El id del hospital es requerido').not().isEmpty(),
    // TODO: crear middleware para validar el array de ids
    check('hospital', 'id de hospital no valido').isMongoId(),
    validarCampos,
  ],
  postMedico
);
router.put(
  '/:id',
  [
    validarJwt,
    check('nombre', 'El nombre del medico es requerido').not().isEmpty(),
    check('hospital', 'El id del hospital es requerido').not().isEmpty(),
    validarCampos,
  ],
  putMedico
);
router.delete('/:id', [validarJwt], deleteMedico);
router.get('/:id', [validarJwt], getMedicoById);

module.exports = router;

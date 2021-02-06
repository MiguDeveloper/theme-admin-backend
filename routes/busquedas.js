// ruta raiz: /api/todo

const { Router } = require('express');
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');
const { validarJwt } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/:termino', [validarJwt], getTodo);
router.get('/coleccion/:tabla/:termino', [validarJwt], getDocumentosColeccion);

module.exports = router;

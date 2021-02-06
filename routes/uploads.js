// Api raiz: /api/upload

const { Router } = require('express');
const { uploadFile, mostrarImagen } = require('../controllers/uploads');
const { validarJwt } = require('../middlewares/validar-jwt');
const expressFileUpload = require('express-fileupload');

const router = Router();

// * middleware: quiere decir que luego tendre acceso a la propiedad file dentro del
// * request de controlador 'uploadFile', por ejemplo: req.files.imagen
router.use(expressFileUpload());
router.put('/:tipo/:id', [validarJwt], uploadFile);
router.get('/:tipo/:foto', mostrarImagen);

module.exports = router;

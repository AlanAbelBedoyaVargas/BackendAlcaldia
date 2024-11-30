const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const {newResap, updateResap, activeInactiveResap, getResapPaginate, updateResapByInscription} = require('../controllers/resap37.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/resap37');

const router = Router();


router.get('/',[
    validarJWT,
],getResapPaginate );

router.post('/', [
    validarJWT,
    toUpperCaseConvert,
    getValidateCreate
],newResap );

router.put('/:id', [
    validarJWT,
    toUpperCaseConvert,
    getValidateUpdate
],updateResap);

router.put('/updateByInscription/:id_inscripcion', [
    validarJWT, // Middleware de autenticación
    toUpperCaseConvert,
    // Puedes agregar más middlewares de validación si lo necesitas
], updateResapByInscription);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validateDelete
],activeInactiveResap );


module.exports = router;
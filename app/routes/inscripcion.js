const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getInscripcionPaginate, newInscripcion, updateInscripcion, activeInactiveInscripcion, habilitarCursoInscripcion, asistenciaCursoInscripcion, certificadoCursoInscripcion, newInscripcionManual } = require('../controllers/inscripcion.controller');
const { validateDelete, getValidateUpdate, getValidateCreate, getValidateEstado, getValidateAsistencia, getValidateCertificado, getValidateCreateManual } = require('../middlewares/validators/inscripciones');

const router = Router();


router.get('/',[
    validarJWT,
],getInscripcionPaginate );

router.post('/', [
    validarJWT,
    toUpperCaseConvert,
    getValidateCreate
],newInscripcion );

router.post('/manual/', [
    validarJWT,
    toUpperCaseConvert,
    getValidateCreateManual
],newInscripcionManual );

router.put('/habilitarCurso/:uuid', [
    validarJWT,
    toUpperCaseConvert,
    getValidateEstado
],habilitarCursoInscripcion);

router.put('/asistenciaCurso/:uuid', [
    validarJWT,
    toUpperCaseConvert,
    getValidateAsistencia
],asistenciaCursoInscripcion);

router.put('/certificadoCurso/:uuid', [
    validarJWT,
    toUpperCaseConvert,
    getValidateCertificado
],certificadoCursoInscripcion);

router.put('/destroyAndActive/:uuid', [
    validarJWT,
    validateDelete
],activeInactiveInscripcion );


module.exports = router;
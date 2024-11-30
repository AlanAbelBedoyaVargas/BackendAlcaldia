const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getCursosPaginate, newCurso, updateCurso, activeInactiveCurso, getCursoSearch, toggleActivoCurso } = require('../controllers/cursos.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/cursos');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getCursosPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newCurso );

router.put('/:uuid', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateCurso);

router.put('/destroyAndActive/:uuid', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveCurso );

router.get('/search',[
    validarJWT
],getCursoSearch );

router.put('/toggleActivo/:id', [
    validarJWT,
], toggleActivoCurso);

module.exports = router;
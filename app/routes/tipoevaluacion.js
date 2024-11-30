const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getTipoEvaPaginate, newTipoEva, updateTipoEva, activeInactiveTipoEva, getTipoEvaSearch } = require('../controllers/tipoevaluacion.controller');
const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/tipoevaluaciones');

const router = Router();


router.get('/',[
    validarJWT,
    //validarIsAdmin,
],getTipoEvaPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newTipoEva );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateTipoEva);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveTipoEva );

router.get('/search',[
    validarJWT
], getTipoEvaSearch );

module.exports = router;
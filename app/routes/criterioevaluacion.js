const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getCriterioEvaPaginate, newCriterioEva, updateCriterioEva, activeInactiveCriterioEva, newTipoCriterio, updateTipoCriterio } = require('../controllers/criterioevaluacion.controller');
const { validateDelete, getValidateUpdate, getValidateCreate, getValidateCreateTipo, getValidateUpdateTipo } = require('../middlewares/validators/criterioevaluaciones');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getCriterioEvaPaginate );

router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newCriterioEva );

router.post('/tipocriterio/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreateTipo
],newTipoCriterio );

// router.put('/:id', [
//     validarJWT,
//     validarIsAdmin,
//     toUpperCaseConvert,
//     getValidateUpdate
// ],updateCriterioEva);

router.put('/tipocriterio/:uuid', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdateTipo
],updateTipoCriterio);


router.put('/destroyAndActive/:id', [
    validarJWT,
    validateDelete
],activeInactiveCriterioEva );


module.exports = router;
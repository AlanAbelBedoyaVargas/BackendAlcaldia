const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const {newResap, activeInactiveResap, getResapPaginate, updateResap2} = require('../controllers/resap33.controller');
const { validateDelete, getValidateUpdate, getValidateCreate } = require('../middlewares/validators/resap33');

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
],updateResap2);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validateDelete
],activeInactiveResap );


module.exports = router;
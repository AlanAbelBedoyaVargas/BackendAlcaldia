const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getCapacitacionPaginate, newCapacitacion, updateCapacitacion, activeInactiveCapacitacion, newCapacitacionExterna, toggleActivoCapacitacion  } = require('../controllers/capacitacion.controller');
const { validateDelete, getValidateUpdate, getValidateCreate, getValidateCreateExterna } = require('../middlewares/validators/capacitaciones');
//const { filesExist,  filesValidateSize } = require("../middlewares/validators/validar-files");
const fileUpload = require('express-fileupload');

const router = Router();

router.use(fileUpload());

router.get('/',[
    validarJWT,
],getCapacitacionPaginate );

router.post('/', [
    validarJWT,
    toUpperCaseConvert,
    getValidateCreate
],newCapacitacion );

router.post('/externa/', [
    validarJWT,    
    toUpperCaseConvert,
    getValidateCreateExterna
],newCapacitacionExterna );

router.put('/:uuid', [
    validarJWT,
    toUpperCaseConvert,
    getValidateUpdate
],updateCapacitacion);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validateDelete
],activeInactiveCapacitacion );

router.put('/toggleActivo/:id', [
    validarJWT,
], toggleActivoCapacitacion);
module.exports = router;
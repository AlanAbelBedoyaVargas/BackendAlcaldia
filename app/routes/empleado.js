const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getEmpleadoPaginate, getEmpleado, getEmpleadoSinInc /*, newEmpleado, updateEmpleado, activeInactiveEmpleado*/ } = require('../controllers/empleado.controller');
//const { getValidateCreate, getValidateUpdate, validateDelete } = require('../middlewares/validators/empleados');

const router = Router();


router.get('/',[
    validarJWT,
    validarIsAdmin,
],getEmpleadoPaginate );

router.get('/user/',[
    validarJWT,
    //validarIsAdmin,
],getEmpleado );

router.get('/inscripcion',[
    validarJWT
],getEmpleadoSinInc );

/*router.post('/', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    //getValidateCreate
],newEmpleado );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    //getValidateUpdate
],updateEmpleado);

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    //validateDelete
],activeInactiveEmpleado );
*/

module.exports = router;
const { Router } = require('express');
const { validateDelete, getValidateCreate, getValidateUpdate } = require('../middlewares/validators/user');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const { validarIsAdmin } = require('../middlewares/validators/validar-is-admin');
const toUpperCaseConvert = require('../middlewares/touppercase-convert');
const { getUsers, newUser, updateUser, activeInactiveUser } = require('../controllers/user.controller');

const router = Router();


router.get('/',[
    validarJWT,
    //validarIsAdmin
],getUsers );

router.post('/', [
    //validarJWT,
    //validarIsAdmin,
    toUpperCaseConvert,
    getValidateCreate
],newUser );

router.put('/:id', [
    validarJWT,
    validarIsAdmin,
    toUpperCaseConvert,
    getValidateUpdate
],updateUser );

router.put('/destroyAndActive/:id', [
    validarJWT,
    validarIsAdmin,
    validateDelete
],activeInactiveUser );


module.exports = router;
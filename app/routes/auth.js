const { Router } = require('express');
const { check } = require('express-validator');
const { login, renewToken } = require('../controllers/auth.controller');
const { validatedResponse } = require('../middlewares/validated-response');
const { validarJWT } = require('../middlewares/validators/validar-jwt');

const router = Router();


router.post('/',[
    check('ci', 'El número de documento es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('ci','El número de documento ci debe ser un string').isString(),
    validatedResponse
], login);

router.post('/refresh',[
    check('Authorization', 'El token es necesario').not().isEmpty(),
    validatedResponse,
    validarJWT
],renewToken);


module.exports = router;
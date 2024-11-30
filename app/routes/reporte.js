const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const {generatePdfReportResap, inscritosCapacitacion, generatePdfResap37, generarCertificado} = require('../controllers/reporte.controller');


const router = Router();



router.get('/resap36', [
    validarJWT,
], generatePdfReportResap);

router.get('/resap37', [
    validarJWT,
], generatePdfResap37);


router.get('/inscritos', [
    validarJWT,
], inscritosCapacitacion );

router.get('/certificado', [
    validarJWT,
], generarCertificado );

module.exports = router;
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validators/validar-jwt');
const {generatePdfReportResap, inscritosCapacitacion, generatePdfResap37, generarCertificado, generatePdfReportResap37, generatePdfReportResap33} = require('../controllers/reporte.controller');


const router = Router();



router.get('/resap36', [
    validarJWT,
], generatePdfReportResap);

router.get('/pdfresap37', [
    validarJWT,
], generatePdfResap37);

router.get('/resap37', [
    validarJWT,
], generatePdfReportResap37);

router.get('/resap33', [
    validarJWT,
], generatePdfReportResap33);

router.get('/inscritos', [
    validarJWT,
], inscritosCapacitacion );

router.get('/certificado', [
    validarJWT,
], generarCertificado );

module.exports = router;
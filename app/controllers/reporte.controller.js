const PdfPrinter = require('pdfmake');
const fonts = require('../helpers/generator-pdf/fonts');
const styles = require('../helpers/generator-pdf/styles');
const path = require('path');
const { Op } = require("sequelize");
const fs = require('fs');
const fromDateUTCToText = require('../helpers/date');

const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//const { Jobs } = require('../../database/config');
const moment = require('moment');
const { Inscripcion, Curso, Empleado, CriterioEvaluacion, sequelize } = require('../database/config');
const { TipoEvaluacion } = require('../database/config');
const { alignment } = require('excel4node/distribution/lib/types');

const imagePath = path.join(__dirname, '../../uploads/mpdf/escudo-gamc.png');
const imagePathCertificado = path.join(__dirname, '../../uploads/certificado.jpg');

//Agregué a la funcion dataPdfReturn el parametro resap y titulo
const dataPdfReturn = (resap,titulo,jobs, userAuth) => [
    {
        image: 'data:image/png;base64,' + fs.readFileSync(imagePath, 'base64'),
        width: 50,
        absolutePosition: { x: 25, y: 15 }
    },
    {
        text: 'GOBIERNO AUTÓNOMO MUNICIPAL DEL CERCADO - COCHABAMBA', style: 'titleHeader',
        absolutePosition: { x: 8, y: 34 },
    },
    {
        text: 'REGLAMENTO ESPECIFICO DEL SISTEMA DE ADMINISTRACIÓN DEL PERSONAL', style: 'text', alignment: 'center',
        absolutePosition: { x: 8, y: 50 },
    },
    // {   text: new Date().toLocaleDateString('es-ES', options), style: 'fechaDoc',
    //     absolutePosition: { y: 16 },
    // },
    // {   text: `Impreso por: ${userAuth.employee}`, style: 'fechaDoc',
    //     absolutePosition: {  y: 27 }
    // },
    {
        canvas: [{
            type: 'rect', x: 60, y: -20, w: 470,
            h: 1,
            lineWidth: 1,
            lineColor: '#276fb8'
        }]
    },
    { text: titulo, style: 'title', absolutePosition: { y: 92 } },
    { text: 'Form. RESAP '+resap, absolutePosition: { x: 475, y: 102 } },
    { canvas: [{ type: 'rect', x: 430, y: -45, w: 100, h: 30 }] },

];

//Reporte RESAP 36
const generatePdfReportResap = async (req = request, res = response) => {
    try {
        const { status, activo, uuid } = req.query;
        const optionsDb1 = {
            order: [['id', 'ASC']],
            where: {
                [Op.and]: [
                    { uuid },
                ],
            },
            include: [
                { association: 'inscripcion_empleado', attributes: { exclude: ['updatedAt'] } },
                {
                    association: 'incripcion_capacitacion', attributes: { exclude: ['updatedAt'] },
                    include: [
                        { association: 'capacitacion_curso', attributes: { exclude: ['updatedAt'] } }
                    ]
                },
            ]
        };

        let inscReport = await Inscripcion.findAll(optionsDb1);
        let dataPdf = dataPdfReturn(36, 'EVALUACIÓN DEL EVENTO DE CAPACITACIÓN'); //PDF         
        let a = JSON.stringify(inscReport);
        let b = JSON.parse(a);
        dataPdf.push({ text: 'DATOS DEL EVENTO', style: 'subheader', fontSize: 14, bold: true, });
        var table1 = {
            //layout: 'lightHorizontalLines', // optional
            style: 'tableExample',
            table: {
                //headerRows: 1,
                widths: [184, 75, 75, 75, 75],

                body: [
                    [{ text: 'FECHA DE REALIZACIÓN', bold: true }, { text: 'DESDE', bold: true }, b[0].incripcion_capacitacion.fecha_inicio, { text: 'HASTA', bold: true }, b[0].incripcion_capacitacion.fecha_fin],
                    [{ text: 'HORARIO DE REALIZACIÓN', bold: true }, { text: 'DE HORAS', bold: true }, b[0].incripcion_capacitacion.horario_inicio, { text: 'A HORAS', bold: true }, b[0].incripcion_capacitacion.horario_fin],
                    [{ text: 'NOMBRE DEL EVENTO', bold: true }, { text: b[0].incripcion_capacitacion.capacitacion_curso.nombre, style: 'text', colSpan: 4, alignment: 'center' }],
                    [{ text: 'INSTITUCIÓN ORGANIZADORA', bold: true }, { text: b[0].incripcion_capacitacion.inst_organizadora, style: 'text', colSpan: 4, alignment: 'center' }],
                ]
            }
        };
        dataPdf.push(table1);

        const optionsDb2 = {
            order: [['id', 'ASC']],
            include: [
                {
                    association: 'tipo_criterio', attributes: { exclude: ['updatedAt'] },
                    where: { resap: 36 }, //Adicion para incluir solo los criterios del 
                    include: [{
                        association: 'criterio_resap', attributes: { exclude: ['updateAt'] },
                        include: [{
                            association: 'inscripcion_resap', attributes: { exclude: ['updateAt'] },
                            where: { [Op.and]: [{ uuid },] },
                        }]
                    }]
                },

            ]
        };
        let tipoEva = await TipoEvaluacion.findAll(optionsDb2);
        // let c = JSON.stringify(tipoEva);
        // console.log("Este es el contenido en formato JSON", c);
        tipoEva.forEach(resp => {
            dataPdf.push({ text: ' ' });
            dataPdf.push({ text: resp.nombre, style: 'subheader', fontSize: 14, bold: true, });
            var table2 = {
                //layout: 'lightHorizontalLines', // optional
                style: 'tableExample',
                table: {
                    headerRows: 2,
                    widths: [264, 55, 55, 55, 55],

                    body: [
                        [{ text: 'CRITERIO DE EVALUACIÓN', bold: true, rowSpan: 2, alignment: 'center' }, { text: 'PARAMETROS', bold: true, colSpan: 4, alignment: 'center' }, {}, {}, {}],
                        [{}, { text: 'MUY BUENO', bold: true, style: 'criterioEva', alignment: 'center' }, { text: 'BUENO', bold: true, style: 'criterioEva', alignment: 'center' }, { text: 'ACEPTABLE', bold: true, style: 'criterioEva', alignment: 'center' }, { text: 'DEFICIENTE', bold: true, style: 'criterioEva', alignment: 'center' }]
                    ]
                }
            };
            //for criterio evaluacion
            resp.tipo_criterio.forEach(resp2 => {
                const rowTable = [{ text: resp2.nombre, bold: true, style: 'fechaDoc', alignment: 'left' }, { text: resp2.criterio_resap[0].estado == 'MUY BUENO' ? 'X' : '', style: 'marcacionEva' }, { text: resp2.criterio_resap[0].estado == 'BUENO' ? 'X' : '', style: 'marcacionEva' }, { text: resp2.criterio_resap[0].estado == 'ACEPTABLE' ? 'X' : '', style: 'marcacionEva' }, { text: resp2.criterio_resap[0].estado == 'DEFICIENTE' ? 'X' : '', style: 'marcacionEva' }];
                table2.table.body.push(rowTable);
            })

            dataPdf.push(table2);
        });

        var table3 = {
            //layout: 'lightHorizontalLines', // optional
            style: 'tableExample',
            table: {
                //headerRows: 1,
                widths: [520],

                body: [[{ text: ' ', bold: true }],
                ]
            }
        };
        dataPdf.push({ text: ' ' });
        dataPdf.push({ text: 'COMENTARIO DEL PARTICIPANTE', fontSize: 14, bold: true, });
        dataPdf.push(table3);


        let docDefinition = {
            content: dataPdf,
            footer: function (currentPage, pageCount) {
                return [
                    {
                        text: currentPage.toString() + ' de ' + pageCount,
                        alignment: 'right', margin: [0, 20, 20, 0],
                    }
                ]
            },
            // watermark: { text: 'TEST ZOONOSIS', opacity: 0.1, bold: true, italics: false },
            styles: styles,
            pageSize: 'LETTER',
            //pageOrientation: 'landscape',
            pageOrientation: 'portrait',
        };

        const printer = new PdfPrinter(fonts);
        let pdfDoc = printer.createPdfKitDocument(docDefinition);
        let chunks = [];
        pdfDoc.on("data", (chunk) => { chunks.push(chunk); });
        pdfDoc.on("end", () => {
            const result = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf;');
            res.setHeader('Content-disposition', `filename=report_assignments_${new Date().toJSON().split('T')[0]}.pdf`);
            return res.send(result);
        });
        pdfDoc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        const pathImage = path.join(__dirname, `../../uploads/none-img.jpg`);
        return res.sendFile(pathImage);
    }
}

//Alternativa 37
const generatePdfReportResap37 = async (req = request, res = response) => {
    try {
        const { uuid } = req.query;
        const optionsDb1 = {
            order: [['id', 'ASC']],
            where: {
                [Op.and]: [
                    { uuid },
                ],
            },
            include: [
                { association: 'inscripcion_empleado', attributes: { exclude: ['updatedAt'] } },
                {
                    association: 'incripcion_capacitacion', attributes: { exclude: ['updatedAt'] },
                    include: [
                        { association: 'capacitacion_curso', attributes: { exclude: ['updatedAt'] } }
                    ]
                },
            ]
        };

        let inscReport = await Inscripcion.findAll(optionsDb1);
        let dataPdf = dataPdfReturn(37, "EVALUACIÓN DE RESULTADOS DE LA CAPACITACIÓN"); //PDF         
        let a = JSON.stringify(inscReport);
        // console.log("Este es el contenido en formato JSON",a);
        let b = JSON.parse(a);

        dataPdf.push({ text: 'DATOS DE IDENTIFICACION', style: 'subheader', fontSize: 14, bold: true, });

        let nombre_completo = b[0].inscripcion_empleado.nombre + " " + b[0].inscripcion_empleado.otro_nombre + " " + b[0].inscripcion_empleado.paterno + " " + b[0].inscripcion_empleado.materno;

        var table1 = {
            style: 'tableExample',
            table: {
                //headerRows: 1,
                widths: [184, 200],

                body: [
                    [{ text: 'NOMBRE Y APELLIDO DEL SERVIDOR MUNICIPAL', bold: true, alignment: 'center' }, { text: nombre_completo, alignment: 'center' }],
                    [{ text: 'NOMBRE DEL PUESTO QUEOCUPA', bold: true, alignment: 'center' }, { text: b[0].inscripcion_empleado.cargo, alignment: 'center' }],
                ]
            },

        };
        dataPdf.push(table1);
        dataPdf.push({ text: ' ' });
        dataPdf.push({ text: 'DATOS DEL AREA Y UNIDAD', style: 'subheader', fontSize: 14, bold: true, });



        var table2 = {
            style: 'tableExample',
            table: {
                //headerRows: 1,
                widths: [184, 200],

                body: [
                    [{ text: 'DEPARTAMENTO', bold: true, alignment: 'center' }, { text: b[0].inscripcion_empleado.unidad, alignment: 'center' }]
                ]
            },

        };
        dataPdf.push(table2);
        dataPdf.push({ text: ' ' });
        dataPdf.push({ text: 'DATOS DEL EVENTO DE CAPACITACION', style: 'subheader', fontSize: 14, bold: true, });
        var table3 = {
            //layout: 'lightHorizontalLines', // optional
            style: 'tableExample',
            table: {
                //headerRows: 1,
                widths: [184, 75, 75, 75, 75],

                // body: [
                //     [{ text: 'FECHA DE REALIZACIÓN', bold: true }, { text: '', bold: true }, { text: 'DESDE', bold: true }, { text: '', bold: true, colSpan: 2 }],
                //     [{ text: 'HORARIO DE REALIZACIÓN', bold: true }, { text: '', bold: true }, { text: 'DE HORAS', bold: true }, { text: '', bold: true, colSpan: 2 }],
                //     [{ text: 'NOMBRE DEL EVENTO', bold: true }, { text: '', bold: true, colSpan: 4, alignment: 'center' }],
                //     [{ text: 'INSTITUCIÓN ORGANIZADORA', bold: true }, { text: '', bold: true, colSpan: 4, alignment: 'center' }],
                // ]
                body: [
                    [{ text: 'FECHA DE REALIZACIÓN', bold: true }, { text: 'DESDE', bold: true }, b[0].incripcion_capacitacion.fecha_inicio, { text: 'HASTA', bold: true }, b[0].incripcion_capacitacion.fecha_fin],
                    [{ text: 'HORARIO DE REALIZACIÓN', bold: true }, { text: 'DE HORAS', bold: true }, b[0].incripcion_capacitacion.horario_inicio, { text: 'A HORAS', bold: true }, b[0].incripcion_capacitacion.horario_fin],
                    [{ text: 'NOMBRE DEL EVENTO', bold: true }, { text: b[0].incripcion_capacitacion.capacitacion_curso.nombre, style: 'text', colSpan: 4, alignment: 'center' }],
                    [{ text: 'INSTITUCIÓN ORGANIZADORA', bold: true }, { text: b[0].incripcion_capacitacion.inst_organizadora, style: 'text', colSpan: 4, alignment: 'center' }],
                ]
            }
        };
        dataPdf.push(table3);
        dataPdf.push({ text: ' ' });

        //Desde aquí se comienza a modificar
        const optionsDb2 = {
            order: [['id', 'ASC']],
            include: [
                {
                    association: 'tipo_criterio', attributes: { exclude: ['updatedAt'] },
                    where: { resap: 37 }, //Adicion para incluir solo los criterios del
                    include: [{
                        association: 'criterio_resap37', attributes: { exclude: ['updatedAt'] },
                        include: [{
                            association: 'inscripcion_resap37', attributes: { exclude: ['updateAt'] },
                            where: { [Op.and]: [{ uuid },] },
                        }]
                    }]
                },

            ]
        };
        let tipoEva = await TipoEvaluacion.findAll(optionsDb2);
        // let c = JSON.stringify(tipoEva);
        // console.log("Este es el contenido en formato JSON", c);
        tipoEva.forEach(resp => {
            dataPdf.push({ text: ' ' });

            //Si se quiere agregar el nombre de la evaluación se puede descomentar la siguiente línea
            //dataPdf.push({text: resp.nombre, style: 'subheader',fontSize: 14, bold: true,});
            var table4 = {
                //layout: 'lightHorizontalLines', // optional
                style: 'tableExample',
                table: {
                    headerRows: 2,
                    widths: [264, 55, 55, 55, 55],

                    body: [
                        [{ text: 'CRITERIO DE EVALUACIÓN', bold: true, rowSpan: 2, alignment: 'center' }, { text: 'PARAMETROS', bold: true, colSpan: 4, alignment: 'center' }, {}, {}, {}],
                        [{}, { text: 'MUY BUENO', bold: true, style: 'criterioEva', alignment: 'center' }, { text: 'BUENO', bold: true, style: 'criterioEva', alignment: 'center' }, { text: 'ACEPTABLE', bold: true, style: 'criterioEva', alignment: 'center' }, { text: 'DEFICIENTE', bold: true, style: 'criterioEva', alignment: 'center' }]
                    ]
                }
            };
            //for criterio evaluacion
            resp.tipo_criterio.forEach(resp2 => {
                const rowTable = [{ text: resp2.nombre, bold: true, style: 'fechaDoc', alignment: 'left' }, { text: resp2.criterio_resap37[0].estado == 'MUY BUENO' ? 'X' : '', style: 'marcacionEva' }, { text: resp2.criterio_resap37[0].estado == 'BUENO' ? 'X' : '', style: 'marcacionEva' }, { text: resp2.criterio_resap37[0].estado == 'ACEPTABLE' ? 'X' : '', style: 'marcacionEva' }, { text: resp2.criterio_resap37[0].estado == 'DEFICIENTE' ? 'X' : '', style: 'marcacionEva' }];
                table4.table.body.push(rowTable);
            })

            dataPdf.push(table4);
        });

        //Comentarios

        // Validación de comentarios
        const comentariosSet = new Set();
        tipoEva.forEach(evaluacion => {
            evaluacion.tipo_criterio.forEach(criterio => {
                criterio.criterio_resap37.forEach(resap => {
                    if (resap.comentarios) {
                        comentariosSet.add(resap.comentarios); // Agrega los comentarios al conjunto
                    }
                });
            });
        });
        if (comentariosSet.size > 1) {
            throw new Error('Los comentarios no coinciden.');
        }
        // Extraer el comentario único
const comentarioUnico = Array.from(comentariosSet)[0]; // El único comentario válido
        dataPdf.push({ text: ' ' });
        dataPdf.push({ text: 'OTROS COMENTARIOS Y RECOMENDACIONES DEL JEFE INMEDIATO SUPERIOR', style: 'subheader', fontSize: 14, bold: true });
        var table5 = {
            //layout: 'lightHorizontalLines', // optional
            style: 'tableExample',
            table: {

                widths: [284, 228],

                body: [
                    [
                        { text: 'COMENTARIOS Y RECOMENDACIONES', bold: true, alignment: 'center' },
                        { text: 'FIRMA Y SELLO DEL JEFE INMEDIATO SUPERIOR', bold: true, alignment: 'center' }
                    ],
                    [
                        { text: comentarioUnico || 'Sin comentarios', bold: true, style: 'criterioEva', alignment: 'center' },
                        { text: '', bold: true, style: 'criterioEva', alignment: 'center' }
                    ]
                ]
                
            }
        };
        dataPdf.push(table5);
        // Definición del contenido del PDF
        const docDefinition = {
            content: dataPdf,
            footer: function (currentPage, pageCount) {
                return [
                    {
                        text: currentPage.toString() + ' de ' + pageCount,
                        alignment: 'right', margin: [0, 20, 20, 0],
                    }
                ]
            },
            // watermark: { text: 'TEST ZOONOSIS', opacity: 0.1, bold: true, italics: false },
            styles: styles,
            pageSize: 'LETTER',
            //pageOrientation: 'landscape',
            pageOrientation: 'portrait',
        };

        // Generar el PDF
        const printer = new PdfPrinter(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        let chunks = [];

        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => {
            const result = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=sample-report.pdf');
            res.send(result);
        });

        pdfDoc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        const pathImage = path.join(__dirname, `../../uploads/none-img.jpg`);
        return res.sendFile(pathImage);
    }
};


//Reporte RESAP33
//Recibe como parámetro uuid deL Resap33 del que se quiere el reporte (antes lo hacía por el uuid del empleado pero ahora no)
const generatePdfReportResap33 = async (req = request, res = response) => {
    try {
        const { uuid } = req.query;
        const optionsDb1 = {
            order: [['id', 'ASC']],

            include: [
                {
                    association: 'empleado_resap33', attributes: { exclude: ['updatedAt'] },
                    where: {
                        [Op.and]: [
                            { uuid },
                        ],
                    },
                    include: [{ association: 'resap33_conexigido', attributes: { exclude: ['updateAt'] } },
                    {
                        association: 'resap33_conampliar', attributes: { exclude: ['updateAt'] },
                        include: [{ association: 'curso_conampliar', attributes: { exclude: ['updateAt'] } }],
                    },
                    { association: 'resap33_func', attributes: { exclude: ['updateAt'] } },
                    {
                        association: 'resap33_capmateria', attributes: { exclude: ['updateAt'] },
                        include: [{ association: 'curso_capmateria', attributes: { exclude: ['updateAt'] } }],
                    }

                    ],
                },
            ]
        };

        let empReport = await Empleado.findAll(optionsDb1);
        let dataPdf = dataPdfReturn(33, "DETECCION DE NECESIDADES DE CAPACITACION"); //PDF             
        let a = JSON.stringify(empReport);
        //console.log("Este es el contenido en formato JSON", a);
        let b = JSON.parse(a);
        
        dataPdf.push({ text: 'GESTION ' + b[0].empleado_resap33[0].gestion, style: 'title', absolutePosition: { y: 110 } });
        dataPdf.push({ text: 'SECTOR ' + b[0].empleado_resap33[0].sector, alignment: 'center', bold: true, fontSize: 14, absolutePosition: { y: 128 } });
        dataPdf.push({ text: 'DATOS DEL SERVIDOR PÚBLICO Y/O TRABAJADOR MUNICIPAL', style: 'subheader', fontSize: 14, bold: true, });

        let nombre_completo = b[0].nombre + " " + b[0].otro_nombre + " " + b[0].paterno + " " + b[0].materno;
        var table1 = {
            style: 'tableExample',
            table: {
                //headerRows: 1,
                widths: [184, 200],

                body: [
                    [{ text: 'ITEM', bold: true, alignment: 'center' }, { text: b[0].item, alignment: 'center' }],
                    [{ text: 'NOMBRE Y APELLIDOS', bold: true, alignment: 'center' }, { text: nombre_completo, alignment: 'center' }],
                    [{ text: 'NOMBRE DEL PUESTO', bold: true, alignment: 'center' }, { text: b[0].cargo, alignment: 'center' }],
                    [{ text: 'SECRETARIA', bold: true, alignment: 'center' }, { text: b[0].empleado_resap33[0].secretaria, alignment: 'center' }],
                    [{ text: 'DIRECCIÓN', bold: true, alignment: 'center' }, { text: b[0].empleado_resap33[0].dirección, alignment: 'center' }],
                    [{ text: 'DEPARTAMENTO', bold: true, alignment: 'center' }, { text: b[0].unidad, alignment: 'center' }]
                ]
            },

        };
        dataPdf.push(table1);

        //CONOCIMIENTOS EXIGIDOS
        dataPdf.push({ text: ' ' });
        dataPdf.push({ text: 'CONOCIMIENTOS QUE EXIGE EL CARGO (PUESTO)', style: 'subheader', fontSize: 14, bold: true, });

        // Tabla para `resap33_conexigido`
        const tableConExigido = {
            style: 'tableExample',
            table: {
                headerRows: 1,
                widths: ['*', '*'],
                body: [

                ]
            }
        };
        empReport[0].empleado_resap33[0].resap33_conexigido.forEach(conocimiento => {
            tableConExigido.table.body.push([
                conocimiento.conocimientos
            ]);
        });
        dataPdf.push(tableConExigido);


        //CONOCIMIENTOS AMPLIAR
        dataPdf.push({ text: ' ' });
        dataPdf.push({ text: 'CONOCIMIENTOS QUE SE REQUIERE AMPLIAR', style: 'subheader', fontSize: 14, bold: true, });
        var table3 = {
            //layout: 'lightHorizontalLines', // optional
            style: 'tableExample',
            table: {
                //headerRows: 1,
                widths: ['*', '*'],

                body: [

                ]
            }
        };

        empReport[0].empleado_resap33[0].resap33_conampliar.forEach(ampliar => {
            // Verifica si ampliar.conocimientos es válido o si id_curso no es null y tiene la propiedad nombre.
            const conocimientos = ampliar.conocimientos || (ampliar.curso_conampliar && ampliar.curso_conampliar.nombre);

            //Considerando la opcion de que ampliar.conocimientos y curso_ampliar nombre sean null se puede agregar este código
            if (conocimientos) { // Solo agrega la fila si hay contenido válido
                table3.table.body.push([conocimientos]);
            }
        });
        dataPdf.push(table3);
        //FUNCIONES
        dataPdf.push({ text: ' ' });
        dataPdf.push({ text: 'PRIORIDAD DE LOS CONOCIMIENTOS DEMANDADOS', style: 'subheader', fontSize: 14, bold: true });
        var table4 = {
            //layout: 'lightHorizontalLines', // optional
            style: 'tableExample',
            table: {
                // headerRows: 2,
                widths: [170, 170, 52, 52, 52],

                // body: [
                //     [{ text: 'FUNCIONES', bold: true, alignment: 'center' }, { text: 'CONOCIMIENTOS DEMANDADOS', bold: true, alignment: 'center' }, { text: 'PRIORIDAD ALTA', bold: true, style: 'criterioEva', alignment: 'center' }, { text: 'PRIORIDAD MEDIA', bold: true, style: 'criterioEva', alignment: 'center' }, { text: 'PRIORIDAD BAJA', bold: true, style: 'criterioEva', alignment: 'center' }],
                // ]
                body: [
                    [
                        { text: 'FUNCIONES', bold: true, rowSpan: 2, alignment: 'center' }, // Primera celda (rowSpan)
                        { text: 'CONOCIMIENTOS DEMANDADOS', bold: true, rowSpan: 2, alignment: 'center' }, // Segunda celda (rowSpan)
                        { text: 'PRIORIDAD', bold: true, colSpan: 3, alignment: 'center' }, // Celda combinada (colSpan)
                        {}, // Espacio reservado para colSpan
                        {} // Espacio reservado para colSpan
                    ],
                    [
                        {}, // Espacio reservado por rowSpan (FUNCIONES)
                        {}, // Espacio reservado por rowSpan (CONOCIMIENTOS DEMANDADOS)
                        { text: 'ALTA', bold: true, alignment: 'center' }, // Tercera celda (prioridad ALTA)
                        { text: 'MEDIA', bold: true, alignment: 'center' }, // Cuarta celda (prioridad MEDIA)
                        { text: 'BAJA', bold: true, alignment: 'center' } // Quinta celda (prioridad BAJA)
                    ]
                ]
            }
        };
        //for criterio evaluacion
        empReport[0].empleado_resap33[0].resap33_func.forEach(resp2 => {
            const rowTable = [{ text: resp2.funciones, bold: true, style: 'fechaDoc', alignment: 'left' }, { text: resp2.conocimiento_demandado, bold: true, style: 'fechaDoc', alignment: 'left' }, { text: resp2.prioridad == 'ALTA' ? 'X' : '', style: 'marcacionEva' }, { text: resp2.prioridad == 'MEDIA' ? 'X' : '', style: 'marcacionEva' }, { text: resp2.prioridad == 'BAJA' ? 'X' : '', style: 'marcacionEva' }];
            table4.table.body.push(rowTable);
        });
        dataPdf.push(table4);
        dataPdf.push({ text: ' ' });
        dataPdf.push({ text: 'MATERIAS QUE PUEDE CAPACITAR ', style: 'subheader', fontSize: 14, bold: true });
        var table5 = {
            //layout: 'lightHorizontalLines', // optional
            style: 'tableExample',
            table: {

                widths: [284, 228],

                body: [
                    // [{ text: 'COMENTARIOS Y RECOMENDACIONES', bold: true, alignment: 'center' }, { text: 'FIRMA Y SELLO DEL JEFE INMEDIATO SUPERIOR', bold: true, alignment: 'center' }],
                    // [{ text: '', bold: true, style: 'criterioEva', alignment: 'center' }, { text: '', bold: true, style: 'criterioEva', alignment: 'center' }]
                ]
            }
        };
        empReport[0].empleado_resap33[0].resap33_capmateria.forEach(materia => {
            const materias = materia.materias || (materia.curso_capmateria && materia.curso_capmateria.nombre);
            if (materias) { // Solo agrega la fila si hay contenido válido
                table5.table.body.push([materias]);
            }

        });
        dataPdf.push(table5);
        // Definición del contenido del PDF
        const docDefinition = {
            content: dataPdf,
            footer: function (currentPage, pageCount) {
                return [
                    {
                        text: currentPage.toString() + ' de ' + pageCount,
                        alignment: 'right', margin: [0, 20, 20, 0],
                    }
                ]
            },
            // watermark: { text: 'TEST ZOONOSIS', opacity: 0.1, bold: true, italics: false },
            styles: styles,
            pageSize: 'LETTER',
            //pageOrientation: 'landscape',
            pageOrientation: 'portrait',
        };

        // Generar el PDF
        const printer = new PdfPrinter(fonts);
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        let chunks = [];

        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => {
            const result = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename=sample-report.pdf');
            res.send(result);
        });

        pdfDoc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        const pathImage = path.join(__dirname, `../../uploads/none-img.jpg`);
        return res.sendFile(pathImage);
    }
};
const inscritosCapacitacion = async (req = request, res = response) => {
    try {
        let { uuid } = req.query;

        const reporte = await getInfoCapacitacion(uuid);

        // Crear un nuevo libro de Excel
        var excel = require('excel4node');
        const wb = new excel.Workbook();
        const ws = wb.addWorksheet('MiHojaDeExcel');
        let titulo = '"PLANILLAS DE INSCRITOS"';
        let curso = await Curso.findOne({
            include: [
                {
                    association: 'curso_capacitacion',
                    attributes: { exclude: ['createdAt', 'status', 'updatedAt'] },
                    where: { uuid }
                }
            ]
        });

        ws.cell(1, 4).string(titulo);
        ws.cell(2, 2).string('CURSO:');
        ws.cell(2, 3).string(curso.nombre + ' DE FECHA:' + new Date(curso.curso_capacitacion[0].fecha_inicio).toLocaleDateString() + " - " + new Date(curso.curso_capacitacion[0].fecha_fin).toLocaleDateString());


        // Configurar el contenido de la hoja de Excel (esto es solo un ejemplo)
        ws.cell(4, 2).string('N°');
        ws.cell(4, 3).string('NOMBRE Y APELLIDO');
        ws.cell(4, 4).string('CARGO');
        ws.cell(4, 5).string('UNIDAD');
        ws.cell(4, 6).string('ITEM');
        ws.cell(4, 7).string('CARNET');
        ws.cell(4, 8).string('ESTADO INSCRIPCION');
        var i = 5;
        var j = 1;

        reporte.forEach(element => {
            ws.cell(i, 2).number(j);
            ws.cell(i, 3).string(element.nombre_completo);
            ws.cell(i, 4).string(element.cargo);
            ws.cell(i, 5).string(element.unidad);
            ws.cell(i, 6).string((element.item > 0) ? '' + element.item : 'EVENTUAL');
            ws.cell(i, 7).string(element.ci);
            ws.cell(i, 8).string(element.estado);
            i = i + 1;
            j = j + 1;
        });

        // Stream the Excel file directly as a response

        // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        // res.setHeader('Content-Disposition', `attachment; filename=reporte_ ${titulo} .xlsx`);

        wb.writeToBuffer().then(buffer => {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${titulo}.xls`);
            res.send(buffer);
            //res.send(buffer);
        }).catch(err => {
            console.error('Error generating Excel file:', err);
            res.status(500).json({ error: 'Error generating Excel file' });
        });

    } catch (error) {

        const pathImage = path.join(__dirname, `../../uploads/none-img.jpg`);
        return res.sendFile(pathImage);
    }

}
const getInfoCapacitacion = async (uuid) => {

    try {

        let lista = await sequelize.query(`SELECT 
        ee.ci, concat_ws (' ', ee.nombre, ee.otro_nombre, ee.paterno, ee.materno ) AS nombre_completo, ee.cargo, ee.unidad, ee.item  ,i.estado    
      FROM empleados ee 
      inner join inscripcions i ON  i.id_empleado = ee.id inner join capacitacions c on c.id = i.id_capacitacion 
      where c.uuid = '${uuid}' order by  i.estado asc, ee.item asc`,
            { type: Op.SELECT });
        return lista[0];

    } catch (error) {

    }
}
const generatePdfResap37 = async (req = request, res = response) => {

    const filePath = path.join(__dirname, '../../uploads/resap37.pdf');
    res.download(filePath, 'resap37.pdf');
}

const generarCertificado = async (req = request, res = response) => {
    const { status, activo, uuid } = req.query; //uuid inscripcion
    const optionsDb1 = {
        order: [['id', 'ASC']],
        where: {
            [Op.and]: [
                { uuid },
            ],
        },
        include: [
            { association: 'inscripcion_empleado', attributes: { exclude: ['updatedAt'] } },
            {
                association: 'incripcion_capacitacion', attributes: { exclude: ['updatedAt'] },
                include: [
                    { association: 'capacitacion_curso', attributes: { exclude: ['updatedAt'] } }
                ]
            },
        ]
    };
    let inscReport = await Inscripcion.findAll(optionsDb1);
    let nombre_completo = inscReport[0].inscripcion_empleado.nombre + " " + inscReport[0].inscripcion_empleado.otro_nombre + " " + inscReport[0].inscripcion_empleado.paterno + " " + inscReport[0].inscripcion_empleado.materno;
    let nombre_curso = inscReport[0].incripcion_capacitacion.capacitacion_curso.nombre;
    let inst_organizadora = inscReport[0].incripcion_capacitacion.inst_organizadora;
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    let fecha_inicio = fromDateUTCToText(inscReport[0].incripcion_capacitacion.fecha_inicio) /*(new Date(inscReport[0].incripcion_capacitacion.fecha_inicio)).toLocaleDateString('es-BO', options) ;*/
    let carga_horaria = inscReport[0].incripcion_capacitacion.carga_horaria;
    dataPdf = [
        {
            image: 'data:image/png;base64,' + fs.readFileSync(imagePathCertificado, 'base64'),
            width: 800,
            height: 610,
            absolutePosition: { x: 0, y: 0 }
        },
        {
            text: nombre_completo.toUpperCase(), style: 'name',
            absolutePosition: { x: 100, y: 290 },
        },
        {
            stack: [
                {
                    text: [
                        'Por haber participado del Taller de Capacitación "',
                        { text: nombre_curso, italics: true, color: 'violet', },
                        '" , organizado por ', { text: inst_organizadora, italics: true }, ', desarrollado en fecha ', { text: fecha_inicio, italics: true }, ' con una carga horaria de ', , { text: carga_horaria, italics: true }, ' horas académicas.'
                    ], alignment: 'center',
                },
            ],
            style: 'superMargin'
        },
        // {   text: `Por haber participado del Taller de Capacitación “${nombre_curso}”, organizado por ${inst_organizadora}, desarrollado en fecha ${fecha_inicio}, con una carga horaria de ${carga_horaria} horas académicas. `,style: 'text', alignment:'center',
        //     absolutePosition: { x:50, y: 350 },
        // },                
    ];

    //dataPdf.push(table1);
    let docDefinition = {
        content: dataPdf,
        // footer: function(currentPage, pageCount) { return [
        //     {
        //         text: currentPage.toString() + ' de ' + pageCount,
        //         alignment:'right', margin:[0,20,20,0], 
        //     }
        // ] },
        // watermark: { text: 'TEST ZOONOSIS', opacity: 0.1, bold: true, italics: false },
        styles: styles,
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        //pageOrientation: 'portrait',
    };

    const printer = new PdfPrinter(fonts);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    let chunks = [];
    pdfDoc.on("data", (chunk) => { chunks.push(chunk); });
    pdfDoc.on("end", () => {
        const result = Buffer.concat(chunks);
        res.setHeader('Content-Type', 'application/pdf;');
        res.setHeader('Content-disposition', `filename=report_assignments_${new Date().toJSON().split('T')[0]}.pdf`);

        return res.send(result);
    });
    pdfDoc.end();



}



module.exports = {
    generatePdfReportResap,
    inscritosCapacitacion,
    generatePdfResap37,
    generarCertificado,
    generatePdfReportResap37,
    generatePdfReportResap33

};
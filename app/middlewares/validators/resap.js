const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistCriterioEva, idExistInscripcion, idExistResap } = require('./database');

const validationSchema =  {
        resap: {
            isArray: {
                bail:true,
                options: {
                min: 0,
                },
            },
            /*custom: {
                options: { idExistInscripcion, idExistCriterioEva}
            },*/
        },
            
        "resap.*.id_inscripcion": {
            isEmpty: {
                negated: true, errorMessage: "Id inscripción es obligatorio",
            },
            custom: {
                options: idExistInscripcion,
                //errorMessage: 'One or more foreign keys do not exist',
            },
            /*idInt:true*/
        },
        "resap.*.id_criterio_evaluacion": {
            isEmpty: {
                negated: true, errorMessage: "Id criterio evaluación es obligatorio",
            },
            custom: {
                options:  idExistCriterioEva,
                //errorMessage: 'One or more foreign keys do not exist',
            },
        },
        "resap.*.estado": {
            isEmpty: {
                negated: true, errorMessage: "El estado es obligatorio",
            },
            isLength: {
                errorMessage: 'El valor debe tener mínimo a 5 caracteres y máximo 10 caracteres',
                options: { min: 5, max: 10},
            },
        },
        /*"capacitacion.activo": {
            isBoolean: {
                errorMessage: "El estado debe ser de tipo bigint [0,1]",
            }
        }*/
    
    
};

const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistResap},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistResap} },
        activo: {
            isBoolean: {
                errorMessage: "El estado debe ser de tipo boolean [0, 1]",
            }
        }
    }),
    validatedResponse
]

module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete
}


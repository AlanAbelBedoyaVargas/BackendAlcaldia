const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const {  nameExistTipoEva, codExistTipoEva, idExistTipoEva } = require('./database');

const validationSchema =  {
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "El nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 2 caracteres y máximo 100 caracteres',
            options: { min: 2, max: 100},
        },
        custom: { options: nameExistTipoEva },
    },
    activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo bigint [0, 1]",
        }
    }
};

const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistTipoEva},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistTipoEva} },
        activo: {
            isBoolean: {
                errorMessage: "El estado debe ser de tipo bigint [0, 1]",
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


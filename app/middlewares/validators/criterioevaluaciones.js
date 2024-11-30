const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistTipoEva, idExistCriterioEva, uuidExistCriterioEva } = require('./database');

const validationSchema =  {
    id_tipo_evaluacion: {
        isEmpty: {
            negated: true, errorMessage: "Id area es obligatorio",
        },
        custom: { options: idExistTipoEva},
    },
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "El nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 2 caracteres y máximo 200 caracteres',
            options: { min: 2, max: 200},
        },
    },
    activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo bigint [0,1]",
        }
    }
};
const validationSchemaTipo =  {

    nombre_tipo: {
        isEmpty: {
            negated: true, errorMessage: "El nombre tipo es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 2 caracteres y máximo 200 caracteres',
            options: { min: 2, max: 200},
        },
    },
    nombre_criterio: {
        isEmpty: {
            negated: true, errorMessage: "El nombre criterio es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 2 caracteres y máximo 200 caracteres',
            options: { min: 2, max: 200},
        },
    },
    activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo bigint [0,1]",
        }
    }
};

const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateCreateTipo = [
    checkSchema(validationSchemaTipo),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistCriterioEva },
        },
        ...validationSchema
    }),
    validatedResponse
];

const getValidateUpdateTipo= [
    
    checkSchema({
        uuid: {
            in: ["params"],
            custom: { options: uuidExistCriterioEva },
        },
        ...validationSchemaTipo
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistCriterioEva} },
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
    validateDelete,
    getValidateCreateTipo,
    getValidateUpdateTipo
}


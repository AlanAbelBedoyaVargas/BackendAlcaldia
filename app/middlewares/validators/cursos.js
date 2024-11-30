const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const {  nameExistCurso, codExistCurso, uuidExistCurso } = require('./database');

const validationSchema =  {
    codigo: {
        isEmpty: {
            negated: true, errorMessage: "El código es obligatorio",
        },
        isLength: {
            errorMessage: 'El código debe tener mínimo a 1 caracteres y máximo 15 caracteres',
            options: { min: 1, max: 15},
        },
        custom: { options: codExistCurso },
    },
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "El nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 4 caracteres y máximo 100 caracteres',
            options: { min: 4, max: 100},
        },
        custom: { options: nameExistCurso },
    },
    dirigido: {
        isEmpty: {
            negated: true, errorMessage: "El campo dirigido es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo dirigido debe tener mínimo a 4 caracteres y máximo 200 caracteres',
            options: { min: 4, max: 200},
        },
    }
    /*activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo boolean [false, true]",
        }
    }*/
};
const validationUpdateSchema =  {
    nombre: {
        isEmpty: {
            negated: true, errorMessage: "El nombre es obligatorio",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 4 caracteres y máximo 100 caracteres',
            options: { min: 4, max: 100},
        },
        custom: { options: nameExistCurso },
    },
    dirigido: {
        isEmpty: {
            negated: true, errorMessage: "El campo dirigido es obligatorio",
        },
        isLength: {
            errorMessage: 'El campo dirigido debe tener mínimo a 4 caracteres y máximo 200 caracteres',
            options: { min: 4, max: 200},
        },
    }
    /*activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo boolean [false, true]",
        }
    }*/
};

const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        uuid: {
            in: ["params"],
            custom: { options: uuidExistCurso},
        },
        ...validationUpdateSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        uuid: { in: ["params"], custom: { options: uuidExistCurso} },
        activo: {
            isString: {
                errorMessage: "El estado debe ser de tipo string - uuid",
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


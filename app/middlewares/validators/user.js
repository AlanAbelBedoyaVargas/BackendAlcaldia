const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { ciExistUser, emailExistUser, idExistUser } = require('./database');

const validationSchema =  {
    ci: {
        isEmpty: {
            negated: true, bail: true,
            errorMessage: "El carnet de identidad es obligatorio",
        },
        matches: {
            options: /^(?:(?=[E][-])([0-9][0-9]{3,7})|([E][-])?[0-9][0-9]{3,7}|[0-9][0-9]{3,7}[-][0-9][0-9A-Z]?)$/,
            errorMessage: "El carnet de identidad no es valido", 
        },
        custom: { options: ciExistUser },
    },
    email: {
        isEmpty: {
            negated: true, errorMessage: "El correo electrónico es obligatorio",
        },
        isEmail: {
            errorMessage: "El correo electrónico tiene que tener un formato valido",
        },
        isLength: {
            errorMessage: 'El correo electrónico debe tener mínimo a 4 caracteres y máximo 174 caracteres',
            options: { min: 4, max: 174},
        },
        custom: {
            options: emailExistUser,
        },
    },
    /*employee: {
        isEmpty: {
            negated: true, errorMessage: "El nombre es obligatorio",
        },
        isInt: {
            bail: true, negated: true, errorMessage: "El nombre tiene que ser un valor alfabético",
        },
        isLength: {
            errorMessage: 'El nombre debe tener mínimo a 4 caracteres y máximo 174 caracteres',
            options: { min: 4, max: 174},
        },
    },
    unit: {
        isEmpty: {
            negated: true, errorMessage: "La unidad es obligatorio",
        },
        isLength: {
            errorMessage: 'La unidad debe tener mínimo a 4 caracteres y máximo 254 caracteres',
            options: { min: 4, max: 254},
        },
    },
    position: {
        isEmpty: {
            negated: true,
            errorMessage: "La posición o cargo es obligatorio",
        },
        isInt: {
            negated: true,
            errorMessage: "La posición o cargo tiene que ser un valor alfabético",
            bail: true,
        },
        isString: {
            bail: true,
            errorMessage: "La posición debe ser un valor alfabético",
        },
        isLength: {
            errorMessage: 'La posición debe tener mínimo a 4 caracteres y máximo 254 caracteres',
            options: { min: 4, max: 254},
        },
    },
    cellphone: {
        isNumeric: {
            errorMessage: "EL numero de celular debe ser un valor numérico", bail: true,
        },
        isLength: {
            errorMessage: 'EL numero de celular debe tener mínimo 7 caracteres y máximo 8 caracteres',
            options: { min: 7, max: 8},
        },
    },
    item: {
        isEmpty: {
            negated: true,
            errorMessage: "El item es obligatorio",
        },
    },
    role: {
        isEmpty: {
            negated: true,
            errorMessage: "El rol es obligatorio",
        },
        isLength: {
            errorMessage: 'El rol debe tener mínimo a 4 caracteres y máximo 174 caracteres',
            options: { min: 4, max: 174},
        },
    },*/
    password: {
        isEmpty: {
            negated: true, errorMessage: "La contraseña es obligatorio",
        },
        isLength: {
            errorMessage: 'La contraseña debe tener mínimo a 4 caracteres y máximo 174 caracteres',
            options: { min: 4, max: 174},
        },
    },
    /*contractType: {
        isEmpty: {
            negated: true,
            errorMessage: "El tipo de contrato es obligatorio",
        },
        isLength: {
            errorMessage: 'El tipo de contrato debe tener mínimo a 4 caracteres y máximo 254 caracteres',
            options: { min: 4, max: 254},
        },
    },*/
    /*status: {
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
        id: {
            custom: { options: idExistUser},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { custom: { options: idExistUser} },
        /*activo: {
             Boolean: {
                errorMessage: "El estado debe ser de tipo boolean [false, true]",
            }
        }*/
    }),
    validatedResponse
]


module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete
}


const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const {  idExistCapacitacion, idExistEmpleado, existDobleInscripcion, idExistUser, idExistInscripcion, uuidExistInscripcion } = require('./database');

const validationSchema =  {
    id_empleado: {
        isEmpty: {
            negated: true, errorMessage: "Id empleado es obligatorio",
        },
        custom: { options: idExistEmpleado, existDobleInscripcion},
    },
    id_capacitacion: {
        isEmpty: {
            negated: true, errorMessage: "Id capacitacion es obligatorio",
        },
        custom: { options: idExistCapacitacion, existDobleInscripcion},
    },
    asistencia: {
        //isEmpty: {
        //    negated: true, errorMessage: "El estado inscripción es obligatorio",
        //},
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'La asistencia debe tener mínimo a 2 caracteres y máximo 2 caracteres',
            options: { min: 2, max: 2},
        },
        //custom: { options: codigoExistCapacitacion },
    },
    certificado: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El certificado debe tener mínimo a 2 caracteres y máximo 2 caracteres',
            options: { min: 2, max: 2},
        },
    },
    motivo_rechazo: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 0 caracteres y máximo 300 caracteres',
            options: { min: 0, max: 300},
        },
    },
    aprobado: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 2 caracteres y máximo 2 caracteres',
            options: { min: 2, max: 2},
        },
    },
    fecha_inscripcion: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 8 caracteres y máximo 8 caracteres',
            options: { min: 8, max: 8},
        },
    },
    fecha_aprobacion: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 8 caracteres y máximo 8 caracteres',
            options: { min: 8, max: 8},
        },
    },
    usuario_aprobacion: {
        optional: { options: { checkFalsy: true } },
        custom: { options: idExistUser},
    },
    activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo bigint [0,1]",
        }
    }
};
const validationManualSchema =  {
    id_empleado: {
        isEmpty: {
            negated: true, errorMessage: "Id empleado es obligatorio",
        },
        //custom: { options: idExistEmpleado, existDobleInscripcion},
    },
    ci: {
        isEmpty: {
            negated: true, errorMessage: "Num. Documento empleado es obligatorio",
        },        
    },
    id_capacitacion: {
        isEmpty: {
            negated: true, errorMessage: "Id capacitacio es obligatorio",
        },
        custom: { options: idExistCapacitacion, existDobleInscripcion},
    },
    asistencia: {
        //isEmpty: {
        //    negated: true, errorMessage: "El estado inscripción es obligatorio",
        //},
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'La asistencia debe tener mínimo a 2 caracteres y máximo 2 caracteres',
            options: { min: 2, max: 2},
        },
        //custom: { options: codigoExistCapacitacion },
    },
    certificado: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El certificado debe tener mínimo a 2 caracteres y máximo 2 caracteres',
            options: { min: 2, max: 2},
        },
    },
    motivo_rechazo: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 0 caracteres y máximo 300 caracteres',
            options: { min: 0, max: 300},
        },
    },
    aprobado: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 2 caracteres y máximo 2 caracteres',
            options: { min: 2, max: 2},
        },
    },
    fecha_inscripcion: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 8 caracteres y máximo 8 caracteres',
            options: { min: 8, max: 8},
        },
    },
    fecha_aprobacion: {
        optional: { options: { checkFalsy: true } },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 8 caracteres y máximo 8 caracteres',
            options: { min: 8, max: 8},
        },
    },
    usuario_aprobacion: {
        optional: { options: { checkFalsy: true } },
        custom: { options: idExistUser},
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

const getValidateCreateManual = [
    checkSchema(validationManualSchema),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistInscripcion},
        },
        ...validationSchema
    }),
    validatedResponse
];
const getValidateEstado= [
    checkSchema({
        uuid: {
            in: ["params"],
            custom: { options: uuidExistInscripcion},
        },
        estado: {
            isEmpty: {
                negated: true, errorMessage: "El estado inscripción es obligatorio",
            },
            isLength: {
                errorMessage: 'El estado debe tener mínimo a 1 caracteres y máximo 10 caracteres',
                options: { min: 1, max: 10},
            },
            //custom: { options: codigoExistCapacitacion },
        },

    }),
    validatedResponse
];
const getValidateAsistencia= [
    checkSchema({
        uuid: {
            in: ["params"],
            custom: { options: uuidExistInscripcion},
        },
        asistencia: {
            isEmpty: {
                negated: true, errorMessage: "La asistecia a la capacitacion es obligatorio",
            },
            isLength: {
                errorMessage: 'El asistencia debe tener mínimo a 2 caracteres y máximo 2 caracteres',
                options: { min: 2, max: 2},
            },
            //custom: { options: codigoExistCapacitacion },
        },

    }),
    validatedResponse
];
const getValidateCertificado= [
    checkSchema({
        uuid: {
            in: ["params"],
            custom: { options: uuidExistInscripcion},
        },
        certificado: {
            isEmpty: {
                negated: true, errorMessage: "El certificado de la capacitacion es obligatorio",
            },
            isLength: {
                errorMessage: 'El certificado debe tener mínimo a 2 caracteres y máximo 2 caracteres',
                options: { min: 2, max: 2},
            },
            //custom: { options: codigoExistCapacitacion },
        },

    }),
    validatedResponse
];
const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistInscripcion} },
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
    getValidateEstado,
    getValidateAsistencia,
    getValidateCertificado,
    getValidateCreateManual
}


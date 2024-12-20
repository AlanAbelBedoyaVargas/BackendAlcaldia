
const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistInscripcion, idExistCriterioEva, idExistResap37 } = require('./database');

const validationSchema = {
    resap37: {
        isArray: {
            bail: true,
            options: {
                min: 0,
            },
        },
    },

    "resap37.*.id_inscripcion": {
        isEmpty: {
            bail: true,
            negated: true, errorMessage: "Id inscripción es obligatorio",
        },
        custom: {
            options: idExistInscripcion,
        },
    },
    "resap37.*.comentarios": {
        isString: {
            bail: true,
            errorMessage: "Los comentarios deben ser de tipo texto",
        },
        isLength: {
            options: { min: 1, max: 255 },
            errorMessage: "Los comentarios deben tener entre 1 y 255 caracteres",
        },
    },
    // Validación "criterios"
    "resap37.*.id_criterio_evaluacion": {
        isEmpty: {
            bail: true,
            negated: true,
            errorMessage: "El id de criterio de evaluación es obligatorio",
        },
        custom: {
            options: idExistCriterioEva,
        },
    },
    "resap37.*.estado": {
        isIn: {
            options: [["MUY BUENO", "BUENO", "ACEPTABLE","DEFICIENTE"]],
            errorMessage: "El campo 'estado' debe 'MUY BUENO','BUENO', 'ACEPTABLE' o 'DEFICIENTE'",
        },
        // matches: {
        //     options: [/^(aceptable|muy bueno|bueno|regular)$/i],
        //     errorMessage: "La evaluación debe ser 'aceptable', 'muy bueno', 'bueno', o 'regular'",
        // },
    },

};

// Definición de los métodos de validación para crear, actualizar y eliminar
const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateUpdate = [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistResap37 }, // Validar que el ID existe
        },
        comentarios: {
            isString: {
                bail: true,
                errorMessage: "Los comentarios deben ser texto",
            },
            isLength: {
                options: { min: 1, max: 255 },
                errorMessage: "Los comentarios deben tener entre 1 y 255 caracteres",
            },
        },
        estado: {
            isIn: {
                options: [["MUY BUENO", "BUENO", "ACEPTABLE","DEFICIENTE"]],
                errorMessage: "El campo 'estado' debe ser 'MUY BUENO','BUENO', 'ACEPTABLE' o 'DEFICIENTE'",
            },
        },
        activo: {
            isBoolean: {
                errorMessage: "El campo activo debe ser un booleano",
            },
        },
        id_criterio_evaluacion: {
            isInt: {
                bail: true,
                errorMessage: "El ID de criterio de evaluación debe ser un entero",
            },
            custom: {
                options: idExistCriterioEva,
                errorMessage: "El criterio de evaluación no existe",
            },
        },
        id_inscripcion: {
            isInt: {
                bail: true,
                errorMessage: "El ID de inscripción debe ser un entero",
            },
            custom: {
                options: idExistInscripcion,
                errorMessage: "La inscripción no existe",
            },
        },
    }),
    validatedResponse,
];
const validateDelete = [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistResap37 },
        },
        activo: {
            isEmpty: {
                negated: true, errorMessage: "el campo activo es obligatorio",
            },
            isBoolean: {
                errorMessage: "El estado debe ser de tipo boolean [0, 1]",
            },      
        }
    }),
    validatedResponse
];

module.exports = {
    getValidateCreate,
    getValidateUpdate,
    validateDelete
}

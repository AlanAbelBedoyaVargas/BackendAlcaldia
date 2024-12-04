
const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { idExistResap33, idExistCurso, idExistEmpleado } = require('./database');

const validationSchema = {
    resap33: {
        in: ["body"],
        exists: {
            //bail: true,
            errorMessage: "El objeto 'resap33' es obligatorio",
        },
    },
    "resap33.id_empleado": {
        in: ["body"],
        exists: {
            bail: true, // Detener validaciones si este campo no existe
            errorMessage: "El id del empleado es obligatorio",
        },
        isEmpty: {
            negated: true,
            errorMessage: "El id del no puede estar vacío",
        },
        isInt: {
            options: { min: 1 },
            errorMessage: "El id del empleado debe ser un número entero positivo",
        },
        toInt: true,
        custom: {
            options: idExistEmpleado,
        },
    },
    "resap33.sector": {
        in: ["body"],
        exists: {
            bail: true, // Detener validaciones si este campo no existe
            errorMessage: "El sector es obligatorio",
        },
        isString: {
            errorMessage: "El sector debe ser un texto",
        },
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: "El sector debe tener entre 3 y 255 caracteres",
        },
    },
    "resap33.secretaria": {
        in: ["body"],
        exists: {
            bail: true, // Detener validaciones si este campo no existe
            errorMessage: "La secretaria es obligatorio",
        },
        isString: {
            errorMessage: "La secretaria debe ser un texto",
        },
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: "La secretaria debe tener entre 3 y 255 caracteres",
        },
    },
    "resap33.dirección": {
        in: ["body"],
        exists: {
            bail: true, // Detener validaciones si este campo no existe
            errorMessage: "La dirección es obligatorio",
        },
        isString: {
            errorMessage: "La dirección debe ser un texto",
        },
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: "La dirección debe tener entre 3 y 255 caracteres",
        },
    },
    "resap33.gestion": {
        in: ["body"],
        exists: {
            bail: true, // Detener validaciones si este campo no existe
            errorMessage: "La gestion es obligatoria",
        },
        isInt: {
            options: { min: 1 },
            errorMessage: "La gestión debe ser un número entero positivo",
        },
    },
    conExigido: {
        isArray: {
            bail: true,
            errorMessage: "El campo 'conExigido' debe ser un arreglo",
        },
    },
    "conExigido.*.id": {
        optional: true,
        isInt: {
            errorMessage: "El campo 'id' dentro de 'conExigido' debe ser un entero o null",
        },
    },
    "conExigido.*.conocimientos": {
        isString: {
            errorMessage: "El campo 'conocimientos' de 'conExigido' debe ser un texto",
        },
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: "El campo 'conocimientos' de 'conExigido' debe tener entre 3 y 255 caracteres",
        },
    },
    conAmpliar: {
        isArray: {
            bail: true,
            errorMessage: "El campo 'conAmpliar' debe ser un arreglo",
        },
    },
    "conAmpliar.*.id": {
        optional: true,
        isInt: {
            errorMessage: "El campo 'id' dentro de 'conAmpliar' debe ser un entero o null",
        },
    },
    //Para este campo id_curso se permite describirlo con valor null, 
    //pero si se desea no incluirlo igual es permitido y se guardará como null en la BDA
    "conAmpliar.*.id_curso": {
        optional: true,
        custom: {
            options: async (value) => {
                if (value !== null) {
                    try {
                        // Llama a la función y captura cualquier error lanzado
                        await idExistCurso(value);
                    } catch (error) {
                        // Si hay un error, lo lanza con el mensaje recibido
                        throw new Error(error.message);
                    }
                }
                return true; // Validación exitosa si no hay errores
            },
        },
    },
    //Para este campo conocimientos se permite describirlo con valor null, 
    //pero si se desea no incluirlo igual es permitido y se guardará como null en la BDA
    "conAmpliar.*.conocimientos": {
        optional: true, // El campo no es obligatorio
        custom: {
            options: (value) => {
                // Permitir valores null
                if (value === null) {
                    return true;
                }

                // Validar que sea un string y cumpla con el rango de longitud
                if (typeof value !== "string") {
                    throw new Error(
                        "El campo 'conocimientos' dentro de 'conAmpliar' debe ser un texto"
                    );
                }
                if (value.length < 3 || value.length > 255) {
                    throw new Error(
                        "El campo 'conocimientos' dentro de 'conAmpliar' debe tener entre 3 y 255 caracteres"
                    );
                }

                return true;
            },
        },
    },
    // "conAmpliar.*.es_otro": {
    //     isBoolean: {
    //         errorMessage: "El campo 'es_otro' debe ser de tipo booleano",
    //     },
    //     toBoolean: true,
    // },
    funcionCon: {
        isArray: {
            bail: true,
            errorMessage: "El campo 'funcionCon' debe ser un arreglo",
        },
    },
    "funcionCon.*.id": {
        optional: true,
        isInt: {
            errorMessage: "El campo 'id' dentro de 'funcionCon' debe ser un entero",
        },
    },
    "funcionCon.*.funciones": {
        isString: {
            errorMessage: "El campo 'funciones' dentro de 'funcionCon' debe ser un texto",
        },
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: "El campo 'funciones' dentro de 'funcionCon' debe tener entre 3 y 255 caracteres",
        },
    },
    "funcionCon.*.conocimiento_demandado": {
        isString: {
            errorMessage: "El campo 'conocimiento demandado' dentro de 'funcionCon' debe ser un texto",
        },
        isLength: {
            options: { min: 3, max: 255 },
            errorMessage: "El campo 'onocimiento demandado' dentro de 'funcionCon' debe tener entre 3 y 255 caracteres",
        },
    },
    "funcionCon.*.prioridad": {
        isIn: {
            options: [["ALTA", "MEDIA", "BAJA"]],
            errorMessage: "El campo 'prioridad' dentro de 'funcionCon' debe ser 'alta', 'media' o 'baja'",
        },
    },

    capMateria: {
        isArray: {
            bail: true,
            errorMessage: "El campo 'capMateria' debe ser un arreglo",
        },
    },
    "capMateria.*.id": {
        optional: true,
        isInt: {
            errorMessage: "El campo 'id' dentro de 'conExigido' debe ser un entero",
        },
    },
    "capMateria.*.materias": {
        optional: true, // El campo no es obligatorio
        custom: {
            options: (value) => {
                // Permitir valores null
                if (value === null) {
                    return true;
                }

                // Validar que sea un string y cumpla con el rango de longitud
                if (typeof value !== "string") {
                    throw new Error(
                        "El campo 'conocimientos' dentro de 'conAmpliar' debe ser un texto"
                    );
                }
                if (value.length < 3 || value.length > 255) {
                    throw new Error(
                        "El campo 'conocimientos' dentro de 'conAmpliar' debe tener entre 3 y 255 caracteres"
                    );
                }

                return true;
            },
        },
        
    },
    "capMateria.*.id_curso": {
        optional: true,
        custom: {
            options: async (value) => {
                if (value !== null) {
                    try {
                        // Llama a la función y captura cualquier error lanzado
                        await idExistCurso(value);
                    } catch (error) {
                        // Si hay un error, lo lanza con el mensaje recibido
                        throw new Error(error.message);
                    }
                }
                return true; // Validación exitosa si no hay errores
            },
        },
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
            custom: { options: idExistResap33 },
        },
        ...validationSchema,
    }),
    validatedResponse
];
const validateDelete = [
    checkSchema({
        id: {
            in: ["params"],
            custom: { options: idExistResap33 },
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

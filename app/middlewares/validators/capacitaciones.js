const { validatedResponse } = require('../validated-response');
const { checkSchema } = require('express-validator');
const { codigoExistCapacitacion, idExistCapacitacion, idExistCurso, uuidExistCapacitacion, esGestionActual, estaFechaActual, cumpleCantCursosExterno } = require('./database');

const validationSchema =  {
    // codigo: {
    //     isEmpty: {
    //         negated: true, errorMessage: "El código capacitacion es obligatorio",
    //     },
    //     isLength: {
    //         errorMessage: 'El nombre debe tener mínimo a 1 caracteres y máximo 10 caracteres',
    //         options: { min: 1, max: 10},
    //     },
    //     custom: { options: codigoExistCapacitacion },
    // },
    /*id_user_charge: {
        isEmpty: {
            negated: true, errorMessage: "Id usuario es obligatorio",
        },
        custom: { options: idExistUser},
    },*/
    fecha_inicio: {
        isEmpty: {
            negated: true, errorMessage: "La fecha inicio capacitación es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
            options: { min: 10, max: 10},
        },
    },
    fecha_fin: {
        isEmpty: {
            negated: true, errorMessage: "La fecha fin de capacitación es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
            options: { min: 10, max: 10},
        },
    },
    horario_inicio: {
        isEmpty: {
            negated: true, errorMessage: "El horario de inicio es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 5 caracteres y máximo 10 caracteres',
            options: { min: 5, max: 10},
        },
    },
    horario_fin: {
        isEmpty: {
            negated: true, errorMessage: "El horario final es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 5 caracteres y máximo 10 caracteres',
            options: { min: 5, max: 10},
        },
    },
    inst_organizadora: {
        isEmpty: {
            negated: true, errorMessage: "La institución organizadora de la capacitación es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 5 caracteres y máximo 200 caracteres',
            options: { min: 5, max: 200},
        },
    },
    capacitador: {
        isEmpty: {
            negated: true, errorMessage: "El capacitador(a) es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 5 caracteres y máximo 100 caracteres',
            options: { min: 5, max: 100},
        },
    },
    direccion: {
        isEmpty: {
            negated: true, errorMessage: "La dirección de la capacitación es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 5 caracteres y máximo 200 caracteres',
            options: { min: 5, max: 200},
        },
    },
    carga_horaria: {
        isEmpty: {
            negated: true, errorMessage: "La carga horaria es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 3 caracteres',
            options: { min: 1, max: 3},
        },
    },
    cupo: {
        isEmpty: {
            negated: true, errorMessage: "El cupo es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 3 caracteres',
            options: { min: 1, max: 3},
        },
    },
    tipo: {
        isEmpty: {
            negated: true, errorMessage: "El tipo capacitación es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 10 caracteres',
            options: { min: 1, max: 10},
        },
    },
    visible: {
        isEmpty: {
            negated: true, errorMessage: "La visibilidad es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 2 caracteres',
            options: { min: 1, max: 2},
        },
    },    
    id_curso: {
        isEmpty: {
            negated: true, errorMessage: "Id area es obligatorio",
        },
        custom: { options: idExistCurso}, //verificamos si existe uuid
    },
    activo: {
        isBoolean: {
            errorMessage: "El estado debe ser de tipo bigint [0,1]",
        }
    },
    gestion: {
        isEmpty: {
            negated: true, errorMessage: "La gestión de la capacitacitación es obligatorio",
        },
        isLength: {
            errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 4 caracteres',
            options: { min: 1, max: 4},
        },
    }
};
const validationSchemaExterna =  {

        fecha_inicio: {
            in: ['body'],
            isEmpty: {
                negated: true, errorMessage: "La fecha inicio capacitación es obligatorio",
            },
            isLength: {
                errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
                options: { min: 10, max: 10},
            },
        },
        fecha_fin: {
            isEmpty: {
                negated: true, errorMessage: "La fecha fin de capacitación es obligatorio",
            },
            isLength: {
                errorMessage: 'El valor debe tener mínimo a 10 caracteres y máximo 10 caracteres',
                options: { min: 10, max: 10},
            },
            custom: {options: estaFechaActual}
        },       
        inst_organizadora: {
            isEmpty: {
                negated: true, errorMessage: "La institución organizadora de la capacitación es obligatorio",
            },
            isLength: {
                errorMessage: 'El valor debe tener mínimo a 5 caracteres y máximo 200 caracteres',
                options: { min: 5, max: 200},
            },
        },
        carga_horaria: {
            isEmpty: {
                negated: true, errorMessage: "La carga horaria es obligatorio",
            },
            isLength: {
                errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 3 caracteres',
                options: { min: 1, max: 3},
            },
        },
        // url_archivo: {
        //     isEmpty: {
        //         negated: true, errorMessage: "El archivo es obligatorio",
        //     },
        //     isLength: {
        //         errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 3 caracteres',
        //         options: { min: 1, max: 255},
        //     },
        // },    
        /*id_curso: {
            isEmpty: {
                negated: true, errorMessage: "Id area es obligatorio",
            },
            custom: { options: idExistCurso},
        },*/
        activo: {
            isBoolean: {
                errorMessage: "El estado debe ser de tipo bigint [0,1]",
            }
        },
        gestion: {
            isEmpty: {
                negated: true, errorMessage: "La gestión de la capacitacitación es obligatorio",
            },
            isLength: {
                errorMessage: 'El valor debe tener mínimo a 1 caracteres y máximo 4 caracteres',
                options: { min: 1, max: 4},
            },
            custom: {options: esGestionActual }
        },
        id_empleado: {
            isEmpty: {
                negated: true, errorMessage: "La gestión de la capacitacitación es obligatorio",
            },
            custom: {options: cumpleCantCursosExterno }
        },
        
    
    
};

const getValidateCreate = [
    checkSchema(validationSchema),
    validatedResponse
];

const getValidateCreateExterna = [
    checkSchema(/*{
        capacitaciones:{
            activo:{
                isBoolean: {
                    errorMessage: "El estado debe ser de tipo boolean [0, 1]",
                }
            }
        }
        }*/
        validationSchemaExterna),
    validatedResponse
];

const getValidateUpdate= [
    checkSchema({
        uuid: {
            in: ["params"],
            custom: { options: uuidExistCapacitacion},
        },
        ...validationSchema
    }),
    validatedResponse
];

const validateDelete = [
    checkSchema({
        id: { in: ["params"], custom: { options: idExistCapacitacion} },
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
    getValidateCreateExterna,
    getValidateUpdate,
    validateDelete    
}


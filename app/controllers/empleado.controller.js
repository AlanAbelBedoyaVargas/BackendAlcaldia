const bcrypt = require('bcrypt');
const generarJWT = require('../helpers/jwt');
const { response, request } = require('express');
const { Empleado, Sequelize, Inscripcion } = require('../database/config');
const paginate = require('../helpers/paginate');
const { Op } = require("sequelize");
const axios = require('axios');
const db = require('../database/config');


const infoEmpledo = async (ciemp) => {
    // Equivalent to `axios.get('https://httpbin.org/get?answer=42')`
    const promise = await axios.get(process.env.API_INFO_EMPLEADOS, { params: { ci: ciemp } });
    //var response = await respuesta;
    //console.log(promise.data);

    // return it
    return promise.data;

    //res.data.args; // { answer: 42 }
    //console.log(resq.data);
    /*res.status(201).json({
        ok:true,
        resq
    });*/
    //return resq.data;
    // Define los parámetros que deseas enviar
    /*const params = {
        ci: ciemp,
    };

    // Realiza la solicitud GET con los parámetros
    const result = axios.get('http://localhost:8000/index.php?r=webservices/v1/info-empleado', { params })
    .catch(error => {
      // Manejo de errores
      //console.error(error);
    
    });
 */
}

/*async function axiosTest(ciemp) {
    //const response = await axios.get('http://localhost:8000/index.php?r=webservices/v1/info-empleado', { params: { ci: ciemp } });
    //const data = await response.json();  
    const response = await axios.get('http://localhost:8000/index.php?r=webservices/v1/info-empleado', { params: { ci: ciemp } })
    .then(res =>  res.status === 200 ? true : false)
    .catch(err => false);
    console.log(response);
    return response;
}*/

/*function infoEmpledo(ciemp){
    const params = {
        ci: ciemp,
    };

    const resultado = axios.get('http://localhost:8000/index.php?r=webservices/v1/info-empleado', { params });

    console.log(resultado);
    return resultado;
}
*/
const newEmpleado = async (req = request, res = response) => {
    try {
        const body = req.body;
        const salt = bcrypt.genSaltSync();
        body.activo = 1;
        const empleadoNew = await Empleado.create(body);
        res.status(201).json({
            ok: true,
            empleadoNew,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{
                msg: `Ocurrió un imprevisto interno | hable con soporte`
            }],
        });
    }
}

const getEmpleadoSinInc = async (req = request, res = response) => {
    try {
        const { nombre, id_capacitacion } = req.query;
        //lista de empleados planilla
        const empPlanilla = await axios.get(process.env.API_EMPLEADOS, { params: { idSucursal: 1 } });
        console.log("emplanilla", empPlanilla);
        // Lista de campos a eliminar          
        const nuevoArray = empPlanilla.data.data.map(objeto => {
            const { id_asigemp, numdocumento, gest_gestion, complemento, nombre, otro_nombre, paterno, materno, ap_esposo, fechanac, nua, asigemp_nro_item, asigemp_ingreso, asigemp_retiro,/* asigemp_fecha_inicio,asigemp_fecha_limite,*/ car_descripcion, sec_descripcion, dir_descripcion, departamento, oficina, id_aporte, id_tipo_movimiento, id_tipocontrato, id_sucursal, ...restoDelObjeto } = objeto;

            // Modifica los campos restantes o agrega nuevos campos
            const nuevoElemento = {
                ...restoDelObjeto,
                id: `${objeto.id_empleado}`,
                ci: `${objeto.numdocumento}`,
                nombre_completo: `${objeto.nombre + ' ' + objeto.otro_nombre + ' ' + objeto.paterno + ' ' + objeto.materno}`,

                // Agrega más campos según sea necesario
            };

            return nuevoElemento;
        });

        const optionsDb = {
            attributes: ['ci'],
            //order: [['id', 'ASC']],
            include: {
                association: 'emplado_inscripcion',
                attributes: { exclude: ['createdAt'] },
                required: true,
                where: {
                    [Op.and]: [
                        id_capacitacion ? { id_capacitacion } : {}
                    ]
                }
            }
        };
        let listaIns = await Empleado.findAll(optionsDb);

        // let sql = 'select e.ci from empleados e inner join inscripcions i ON i.id_empleado = e.id '; 
        // sql = id_capacitacion? sql + ' where i.id_capacitacion = '+ id_capacitacion: "";

        const empleadosFiltrados = nuevoArray.filter(objeto => {
            const tieneFechaLimite = objeto.asigemp_fecha_limite !== null && objeto.asigemp_fecha_limite !== '';
            //Filtrar empleados que ya estan en la lista deinscripciones
            const empleadoEnListaIns = listaIns.some(obj => obj.ci === objeto.ci);

            return !empleadoEnListaIns && (!tieneFechaLimite || new Date(objeto.asigemp_fecha_limite) > new Date());
        });
        return res.status(200).json({
            ok: true,
            empleados: empleadosFiltrados
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}


const getEmpleadoPaginate = async (req = request, res = response) => {
    try {
        const { query, page, limit, type, activo, uuid, tipo, gestion } = req.query;
        const optionsDb = {

            attributes: ['id', 'uuid', 'cod_empleado', 'ci', 'nombre', 'otro_nombre', 'paterno', 'materno', 'item', 'cargo', 'unidad', 'tipo_contrato', 'activo',// [ Sequelize.fn('SUM', Sequelize.col('emplado_inscripcion.id')), 'suma_hora']
            ],
            order: [['id', 'ASC']],
            where: {
                [Op.and]: [
                    { activo }, uuid ? { uuid } : {}
                ],
            },


            include: [{
                association: 'emplado_inscripcion',
                group: [
                    'Empleado.id',
                    'Empleado.uuid',
                    'Empleado.cod_empleado',
                    'Empleado.ci',
                    'Empleado.nombre',
                    'Empleado.otro_nombre',
                    'Empleado.paterno',
                    'Empleado.materno',
                    'Empleado.item',
                    'Empleado.cargo',
                    'Empleado.unidad',
                    'Empleado.tipo_contrato',
                    'Empleado.activo'],
                attributes: [
                    'id',
                    'uuid',
                    [Sequelize.fn('SUM', Sequelize.col('emplado_inscripcion.id')), 'suma_hora']
                ],
            },],
        };


        const empleados = await Empleado.findAll(
            {
                attributes: ['id', 'uuid', 'cod_empleado', 'ci', 'nombre', 'otro_nombre', 'paterno', 'materno', 'item', 'cargo', 'unidad', 'tipo_contrato', 'activo', [db.sequelize.fn('SUM', db.sequelize.col('emplado_inscripcion.incripcion_capacitacion.carga_horaria')), 'total_horas'
                ]],
                group: ['Empleado.id', 'Empleado.uuid', 'Empleado.cod_empleado', 'Empleado.ci', 'Empleado.nombre', 'Empleado.paterno', 'emplado_inscripcion.id', 'emplado_inscripcion->incripcion_capacitacion.id'],
                where: {
                    [Op.and]: [
                        { activo }, uuid ? { uuid } : {}
                    ],
                },
                include: {
                    association: 'emplado_inscripcion',
                    attributes: { exclude: ['createdAt'] },
                    required: false,
                    include: {
                        association: 'incripcion_capacitacion',
                        attributes: { exclude: ['createdAt'] }
                    }
                }

            });

        return res.status(200).json({
            ok: true,
            empleados
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}


const getEmpleado = async (req = request, res = response) => {
    try {
        const { query, page, limit, type, activo, uuid, tipo } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: {
                [Op.and]: [
                    uuid ? { uuid } : {}
                ],

            },
            include: []

        };
        let emp = await paginate(Empleado, page, limit, type, query, optionsDb);
        return res.status(200).json({
            ok: true,
            emp
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

module.exports = {
    infoEmpledo, getEmpleadoPaginate, getEmpleado, getEmpleadoSinInc

};

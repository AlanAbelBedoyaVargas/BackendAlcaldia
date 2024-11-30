const { response, request } = require('express');
const { Op } = require('sequelize');
const { Inscripcion, Empleado, sequelize } = require('../database/config');
const paginate = require('../helpers/paginate');
const axios = require('axios');

const getInscripcionPaginate = async (req = request, res = response) => {
    try {
        let { query, page, limit, type, id_capacitacion, filter, activo, uuid } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: {
                [Op.and]: [
                    activo ? { activo } : {},
                    id_capacitacion ? { id_capacitacion } : {},
                    uuid ? { uuid } : {}
                ],

            },

            include: [
                {
                    association: 'inscripcion_empleado', attributes: { exclude: ['createdAt'] },
                    where: type == 'inscripcion_empleado.ci' ? {
                        ci: { [Op.iLike]: `%${filter}%` }
                    } : type == 'inscripcion_empleado.nombre' ? {
                        nombre: { [Op.iLike]: `%${filter}%` }
                    } : {},
                },
                {
                    association: 'incripcion_capacitacion', attributes: { exclude: ['createdAt', 'status', 'updatedAt'] },
                    include: [{ association: 'capacitacion_curso', attributes: { exclude: ['createdAt', 'status', 'updatedAt'] } }]

                },
            ],
        };
        if (type?.includes('.')) {
            type = null;
        }
        let insCap = await paginate(Inscripcion, page, limit, type, query, optionsDb);
        return res.status(200).json({
            ok: true,
            insCap
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const newInscripcion = async (req = request, res = response) => {
    try {
        const body = req.body;
        const { id_empleado } = body;

        // Obtener la fecha actual
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        // Contar las inscripciones existentes del usuario para el año actual
        const startOfYear = new Date(currentYear, 0, 1); // 1 de enero del año actual
        const endOfYear = new Date(currentYear, 11, 31); // 31 de diciembre del año actual

        const existingInscriptionsCount = await Inscripcion.count({
            where: {
                id_empleado,
                createdAt: {
                    [Op.between]: [startOfYear, endOfYear]
                },
                activo: 1,
            },
        });

        if (existingInscriptionsCount >= 3) {
            return res.status(400).json({
                ok: false,
                errors: [{ msg: `El usuario ya tiene 3 inscripciones en la gestión ${currentYear}` }],
            });
        }

        // Crear la nueva inscripción
        const insNew = await Inscripcion.create({
            ...body,
            createdAt: currentDate // Establecer la fecha de inscripción actual
        });

        return res.status(201).json({
            ok: true,
            insNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: 'Ocurrió un imprevisto interno | hable con soporte' }],
        });
    }
}



const newInscripcionManual = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const body = req.body;
        let newInscrip = {
            "id_capacitacion": body.id_capacitacion,
            "estado": body.estado,
            "activo": body.activo
        };
        //verificar si esta registrado el carnet en la tabla empleados caso contrario registrar
        const emp = await axios.get(process.env.API_INFO_EMPLEADOS, { params: { ci: body.ci } });
        let empleadoNew = null;
        const json_e = emp.data.data;
        if (!emp.data.status) {
            return res.status(422).json({
                ok: false,
                errors: [{
                    msg: `Empleado no esta registrado en el Sistema de Planillas`
                }],
            });
        }
        const ci = json_e[0].num_documento; //json_e[0].num_documento;
        const existDB = await Empleado.findOne({ where: { ci } });
        if (existDB) {
            newInscrip.id_empleado = existDB.id;

        } else {

            let json_emp_new = { "cod_empleado": json_e[0].cod_empleado, "ci": json_e[0].num_documento, "nombre": json_e[0].emp_nombre, "otro_nombre": json_e[0].emp_otro_nombre, "paterno": json_e[0].emp_paterno, "materno": json_e[0].emp_materno, "item": json_e[0].emp_asigemp_nro_item, "cargo": json_e[0].emp_car_descripcion, "unidad": json_e[0].emp_unidad, "tipo_contrato": json_e[0].emp_id_tipocontrato, "activo": 1 };
            empleadoNew = await Empleado.create(json_emp_new, { transaction: t });
            //let a = JSON.stringify( empleadoNew );
            //let b = JSON.parse(a);

            newInscrip.id_empleado = empleadoNew.id;
        }
        const insNew = await Inscripcion.create(newInscrip, { transaction: t });
        await t.commit();
        return res.status(201).json({
            ok: true,
            insNew
        });
    } catch (error) {
        console.log(error);
        await t.rollback();
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const updateInscripcion = async (req = request, res = response) => {
    try {
        const { uuid } = req.params;
        const body = req.body;
        const inscripciones = await Inscripcion.findByPk(id);
        await inscripciones.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Inscripción modificada exitosamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const habilitarCursoInscripcion = async (req = request, res = response) => {
    try {
        const { uuid } = req.params;
        const { estado, motivo_rechazo } = req.body;
        //const inscripciones = await Inscripcion.findByPk(id);
        const inscripciones = await Inscripcion.findOne({ where: { uuid } });
        const usuario_aprobacion = req.userAuth.id;
        const fecha_aprobacion = new Date();
        console.log('estado...', estado);
        await inscripciones.update({ estado, motivo_rechazo, usuario_aprobacion, fecha_aprobacion });
        res.status(201).json({
            ok: true,
            msg: estado == 'REGISTRADO' ? 'Inscripción habilitado exitosamente' : 'Inscripción fue rechazado exitosamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const asistenciaCursoInscripcion = async (req = request, res = response) => {
    try {
        const { uuid } = req.params;
        const { asistencia } = req.body;
        //const inscripciones = await Inscripcion.findByPk(id);
        const inscripciones = await Inscripcion.findOne({ where: { uuid } });
        await inscripciones.update({ asistencia });
        res.status(201).json({
            ok: true,
            msg: 'Asistencia habilitado exitosamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}
const certificadoCursoInscripcion = async (req = request, res = response) => {
    try {
        const { uuid } = req.params;
        const { certificado } = req.body;
        //const inscripciones = await Inscripcion.findByPk(id);
        const inscripciones = await Inscripcion.findOne({ where: { uuid } });
        await inscripciones.update({ certificado });
        res.status(201).json({
            ok: true,
            msg: certificado == 'SI' ? 'Certificado habilitado exitosamente' : 'Certificado des habilitado exitosamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const activeInactiveInscripcion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const inscripciones = await Inscripcion.findByPk(id);
        await inscripciones.update({ activo });
        res.status(201).json({
            ok: true,
            msg: activo ? 'Inscripción activado exitosamente' : 'Inscripción inactivo exitosamente'
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
    getInscripcionPaginate,
    newInscripcion,
    updateInscripcion,
    activeInactiveInscripcion,
    habilitarCursoInscripcion,
    asistenciaCursoInscripcion,
    certificadoCursoInscripcion,
    newInscripcionManual,
};
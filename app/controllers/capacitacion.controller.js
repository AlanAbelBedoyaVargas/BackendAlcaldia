
const { response, request } = require('express');
const { Op, fn, col } = require('sequelize');
const { Capacitacion, Curso, sequelize, Inscripcion } = require('../database/config');
const paginate = require('../helpers/paginate');
const toUpperCase = require('../helpers/to-upper-case');
const path = require('path');
const { fileMoveAndRemoveOld } = require('../helpers/file-upload');

const getCapacitacionPaginate = async (req = request, res = response) => {
    try {
        let { query, page, limit, type, activo, filter, id_curso, uuid, id_empleado, tipo, isjoin, visible, estado } = req.query;
        const isLeftJoin = isjoin ? true : false;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['fecha_inicio', 'ASC']],
            where: {
                [Op.and]: [
                    activo ? { activo } : {},
                    id_curso ? { id_curso } : {},
                    uuid ? { uuid } : {},
                    tipo ? { tipo } : {},
                    visible ? { visible } : {}
                ],
            },
            include: [
                {
                    association: 'capacitacion_curso',
                    attributes: { exclude: ['createdAt'] },
                },
                {
                    association: 'capacitacion_inscripcion',
                    attributes: { exclude: ['createdAt', 'status', 'updatedAt'] },
                    where: {
                        [Op.and]: [
                            id_empleado ? { id_empleado } : {},
                            estado ? { estado } : {}
                        ]
                    },
                    include: [
                        {
                            association: 'inscripcion_resap', attributes: { exclude: ['createdAt'] }
                        },
                    ],
                    required: isLeftJoin
                },
            ],
        };
        if (type?.includes('.')) {
            type = null;
        }
        let capCurso = await paginate(Capacitacion, page, limit, type, query, optionsDb);
        const capacitacionIds = capCurso.data.map(cap => cap.id);
        const aprobadosCounts = await Inscripcion.findAll({
            attributes: ['id_capacitacion', [fn('COUNT', col('id')), 'aprobados']],
            where: {
                id_capacitacion: { [Op.in]: capacitacionIds },
                estado: 'APROBADO'
            },
            group: ['id_capacitacion']
        });
        const aprobadosMap = {};
        aprobadosCounts.forEach(count => {
            aprobadosMap[count.id_capacitacion] = parseInt(count.get('aprobados'), 10);
        });
        const solicitudesCounts = await Inscripcion.findAll({
            attributes: ['id_capacitacion', [fn('COUNT', col('id')), 'solicitudes']],
            where: { id_capacitacion: { [Op.in]: capacitacionIds } },
            group: ['id_capacitacion']
        });

        // Crear un mapa de id_capacitacion a solicitudes
        const solicitudesMap = {};
        solicitudesCounts.forEach(count => {
            solicitudesMap[count.id_capacitacion] = parseInt(count.get('solicitudes'), 10);
        });
        const asistenciaCount = await Inscripcion.findAll({
            attributes: ['id_capacitacion', [fn('COUNT', col('id')), 'asistencias']],
            where: {
                id_capacitacion: { [Op.in]: capacitacionIds },
                asistencia: 'SI'
            },
            group: ['id_capacitacion']
        });
        const asistenciaMap = {};
        asistenciaCount.forEach(count => {
            asistenciaMap[count.id_capacitacion] = parseInt(count.get('asistencias'), 10);
        });
        capCurso.data = capCurso.data.map(cap => {

            const aprobados = aprobadosMap[cap.id] || 0;
            const solicitudes = solicitudesMap[cap.id] || 0;
            const asistencias = asistenciaMap[cap.id] || 0;
            const cupo = cap.cupo || 0;
            if (aprobados >= cupo) {
                console.log(`La capacitación con ID ${cap.id} ha alcanzado el cupo máximo con ${solicitudes} solicitudes. Todos los pendientes serán rechazados.`);

                // Modificar estado de todos los PENDIENTE a RECHAZADO
                Inscripcion.update(
                    { estado: 'RECHAZADO', motivo_rechazo: 'Cupos no disponibles al momento de la solicitud' },
                    {
                        where: {
                            id_capacitacion: cap.id,
                            estado: 'PENDIENTE'
                        }
                    }
                );
            }


            return {
                ...cap.toJSON(), // Aseguramos que sea un objeto plano
                asistencias,
                solicitudes,
                aprobados
            };
        });
        return res.status(200).json({
            ok: true,
            capCurso
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const newCapacitacion = async (req = request, res = response) => {
    try {
        const body = req.body;
        const capacitacionNew = await Capacitacion.create(body);
        return res.status(201).json({
            ok: true,
            capacitacionNew
        });
    } catch (error) {
        //console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}
const newCapacitacionExterna = async (req = request, res = response) => {
    let fielUploadCurso = null;
    if (req.files && Object.keys(req.files).length > 0 && req.files.files) {
        const uploadedFile = req.files.file;
        const directory = 'img/curso_externo';
        try {
            fielUploadCurso = await fileMoveAndRemoveOld(uploadedFile, '', 1, directory);
        } catch (fileError) {
            console.error(`Surgio un problema al subir el archivo - ${fileError.message}`);
        }
    }
    const t = await sequelize.transaction();
    try {
        // const uploadedFile = req.files ? req.files.file : null;
        const { nombre, fecha_inicio, fecha_fin, horario_inicio, horario_fin, inst_organizadora, capacitador, direccion, carga_horaria, activo, gestion, id_empleado, url_archivo, file } = req.body;
        let { id_curso } = req.body;
        //let cap =  JSON.parse(capacitacion) ;
        // let resultCap = toUpperCase(cap)
        // //const {curso, inscripcion} = resultCap;
        //console.log("body----------------------------:", codigo, nombre, fecha_inicio, file );
        //console.log(file);

        /*if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ message: 'No files were uploaded.' });
        }
        const directory = 'img/curso_externo';*/
        // const fielUploadCurso = uploadedFile ? await fileMoveAndRemoveOld (uploadedFile,'',1,directory):'';


        const capacitacion = {
            fecha_inicio: fecha_inicio,
            fecha_fin: fecha_fin,
            inst_organizadora: inst_organizadora,
            carga_horaria: carga_horaria,
            activo: activo,
            gestion: gestion,
            url_archivo: url_archivo,
            tipo: "EXTERNO",
            nombre_archivo: fielUploadCurso, //sera nulo si hay falla al subir el archivo o si no se proporciona
        };
        const inscripcion = {
            id_empleado: id_empleado,
            estado: "APROBADO",
            activo: '1',
        };
        if (typeof nombre === "string") { //si es un String buscar 
            const existDB = await Curso.findOne({
                where: {
                    [Op.or]: [
                        //{  codigo:{[Op.iLike]: `%${codigo}%`}  },
                        { nombre: { [Op.iLike]: `%${nombre}%` } }
                    ],
                },
            });
            if (existDB)
                id_curso = existDB.id;
        }
        if (id_curso > 0) {
            capacitacion.id_curso = id_curso;
        } else { //si no existe se creara curso
            const cursoMax = await Curso.findOne({ order: [['id', 'DESC']] });
            let codigoNew = "";
            if (cursoMax) {
                let curArray = cursoMax.codigo.split('C');
                let num = parseInt(curArray[1]) + 1;
                codigoNew = "C" + num;
            } else {
                codigoNew = "C" + 1;
            }
            const curso = {
                codigo: codigoNew,
                nombre: nombre,
                activo: '1'
            };
            const cursoNew = await Curso.create(curso, { transaction: t });
            let a = JSON.stringify(cursoNew);
            let b = JSON.parse(a);
            capacitacion.id_curso = b.id;
        }

        const capacitacionNew = await Capacitacion.create(capacitacion, { transaction: t });
        let c = JSON.stringify(capacitacionNew);
        let d = JSON.parse(c);
        inscripcion.id_capacitacion = d.id;
        inscripcion.estado = "APROBADO";
        inscripcion.activo = '1';
        const inscripcionNew = await Inscripcion.create(inscripcion, { transaction: t });

        await t.commit();
        return res.status(201).json({
            ok: true,
            inscripcionNew,
            fielUploadCurso,
        });
    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            ok: false,
            errors: [{ msg: ` Ocurrió un imprevisto interno | hable con soporte - No se pudo subir tu archivo - ${error} ` }],
        });
    }
}

const updateCapacitacion = async (req = request, res = response) => {
    try {
        const { uuid } = req.params;
        const body = req.body;
        //const capacitacion = await Capacitacion.findByPk(id);
        const capacitacion = await Capacitacion.findOne({ where: { uuid } });
        await capacitacion.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Capacitación modificada exitosamente'
        });
    } catch (error) {
        //console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const activeInactiveCapacitacion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const capacitacion = await Capacitacion.findByPk(id);
        await capacitacion.update({ activo });
        res.status(201).json({
            ok: true,
            msg: activo ? 'Capacitación activado exitosamente' : 'Capacitación inactivo exitosamente'
        });
    } catch (error) {
        //console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const toggleActivoCapacitacion = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const capacitacion = await Capacitacion.findByPk(id);

        if (!capacitacion) {
            return res.status(404).json({
                ok: false,
                msg: 'Capacitación no encontrada'
            });
        }

        // Convertir 'activo' a número para asegurar la comparación correcta
        const currentActivo = parseInt(capacitacion.activo, 10);
        console.log(`Estado actual de 'activo': ${currentActivo}`);

        const newActivo = currentActivo === 1 ? 0 : 1;
        console.log(`Nuevo valor de 'activo': ${newActivo}`);

        await capacitacion.update({ activo: newActivo });

        return res.status(200).json({
            ok: true,
            msg: 'Estado de la capacitación actualizado exitosamente',
            activo: newActivo
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}



module.exports = {
    getCapacitacionPaginate,
    newCapacitacion,
    newCapacitacionExterna,
    updateCapacitacion,
    activeInactiveCapacitacion,
    toggleActivoCapacitacion
};
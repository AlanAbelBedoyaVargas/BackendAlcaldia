
const { response, request } = require('express');
const { Op } = require('sequelize');
const { Resap37, sequelize } = require('../database/config');
const paginate = require('../helpers/paginate');



const getResapPaginate = async (req = request, res = response) => {
    try {
        let { query, page, limit, type, activo, id_inscripcion } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: {
                [Op.and]: [
                    activo !== undefined ? { activo } : {}, // Filtro por activo
                    id_inscripcion ? { id_inscripcion } : {},

                ],
            },
            include: [
                {
                    association: 'criterio_resap37', attributes: { exclude: ['createdAt'] },
                    include: [
                        {
                            association: 'criterio_tipo', attributes: { exclude: ['createdAt'] },
                        },
                    ]
                },
                { association: 'inscripcion_resap37', attributes: { exclude: ['createdAt', 'updatedAt'] } },
            ],
        };
        if (type?.includes('.')) {
            type = null;
        }
        let resap37 = await paginate(Resap37, page, limit, type, query, optionsDb);
        return res.status(200).json({
            ok: true,
            resap37
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const newResap = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const { resap37 } = req.body;

        const result = await sequelize.transaction(async (t) => {
            //let resaps = JSON.parse(resap);
            resap37.forEach(resa => {
                resa.id_inscripcion = resa.id_inscripcion;
                resa.id_criterio_evaluacion = resa.id_criterio_evaluacion;
                resa.activo = 1;
            });//asignate id job in table location
            const newResap = await Resap37.bulkCreate(resap37, { transaction: t });
            return newResap;
        });
        await t.commit();
        return res.status(201).json({
            ok: true,
            result
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

//Actualizar cada registro de la tabla resap37 uno por uno
const updateResap = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const resap37 = await Resap37.findByPk(id);
        await resap37.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Resap37 modificada exitosamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

//Actualizar varios registros de la tabla resap37 en una sola petición
const updateResapByInscription = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const { id_inscripcion } = req.params; // ID del inscrito
        const { resap37 } = req.body; // Lista de registros para actualizar

        // Validación: verificar que todos los registros correspondan al mismo id_inscripcion
        if (!Array.isArray(resap37) || resap37.length === 0) {
            return res.status(400).json({
                ok: false,
                errors: [{ msg: "El cuerpo de la solicitud debe contener un array de registros." }],
            });
        }

        // Verificar si todos los registros tienen el mismo id_inscripcion
        const isValid = resap37.every((record) => record.id_inscripcion === parseInt(id_inscripcion));
        if (!isValid) {
            return res.status(400).json({
                ok: false,
                errors: [{ msg: "Todos los registros deben llevar id y pertenecer al mismo id_inscripcion." }],
            });
        }

        // Actualizar cada registro en la base de datos
        const promises = resap37.map((record) => {
            return Resap37.update(
                {
                    comentarios: record.comentarios, // Puedes agregar más campos a actualizar aquí
                    estado: record.estado, // Ejemplo: actualizar estado
                    activo: record.activo,
                    id_criterio_evaluacion: record.id_criterio_evaluacion,
                },
                {
                    where: {
                        id: record.id,
                        id_inscripcion: id_inscripcion,
                    },
                    transaction: t,
                }
            );
        });

        await Promise.all(promises); // Ejecutar todas las actualizaciones en paralelo
        await t.commit();

        return res.status(200).json({
            ok: true,
            msg: "Registros actualizados exitosamente.",
        });
    } catch (error) {
        console.error(error);
        await t.rollback();
        return res.status(500).json({
            ok: false,
            errors: [{ msg: "Ocurrió un imprevisto interno | Hable con soporte." }],
        });
    }
};


const activeInactiveResap = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const resap37 = await Resap37.findByPk(id);
        await resap37.update({ activo });
        res.status(201).json({
            ok: true,
            msg: activo ? 'Formulario Resap activado exitosamente' : 'Formulario Resap inactivo exitosamente'
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
    getResapPaginate,
    newResap,
    updateResap,
    updateResapByInscription,
    activeInactiveResap
};

const { response, request } = require('express');
const { Op } = require('sequelize');
const { Resap, sequelize } = require('../database/config');
const paginate = require('../helpers/paginate');

const getResapPaginate = async (req = request, res = response) => {
    try {
        let { query, page, limit, type, activo, id_inscripcion } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: {
                [Op.and]: [
                    { activo }, id_inscripcion ? { id_inscripcion } : {},
                    /*type =='capacitacion_curso.codigo' ? {
                        codigo:{[Op.iLike]: `%${filter}%`}
                    }:{},                    */
                ],
                /*[Op.or]:[
                    {
                        codigo:{[Op.iLike]: `%${filter}%`}
                    },
                    {
                        tipo:{[Op.iLike]: `%${filter}%`}
                    }
                ],*/
            },
            include: [
                {
                    association: 'resap_criterio', attributes: { exclude: ['createdAt'] },
                    include: [
                        {
                            association: 'criterio_tipo', attributes: { exclude: ['createdAt'] },
                        },
                    ]
                },
                { association: 'inscripcion_resap', attributes: { exclude: ['createdAt', 'updatedAt'] } },
            ],
        };
        if (type?.includes('.')) {
            type = null;
        }
        let resap = await paginate(Resap, page, limit, type, query, optionsDb);
        return res.status(200).json({
            ok: true,
            resap
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
        const { resap } = req.body;

        const result = await sequelize.transaction(async (t) => {
            //let resaps = JSON.parse(resap);
            resap.forEach(resa => {
                resa.id_inscripcion = resa.id_inscripcion;
                resa.id_criterio_evaluacion = resa.id_criterio_evaluacion;
                resa.activo = 1;
            });//asignate id job in table location
            const newResap = await Resap.bulkCreate(resap, { transaction: t });
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

const updateResap = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const resap = await Resap.findByPk(id);
        await resap.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Resap modificada exitosamente'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
}

const activeInactiveResap = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const resap = await Resap.findByPk(id);
        await resap.update({ activo });
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
    activeInactiveResap
};
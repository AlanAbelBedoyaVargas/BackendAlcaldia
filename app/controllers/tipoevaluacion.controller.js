
const { response, request } = require('express');
const { Op } = require("sequelize");
const { TipoEvaluacion } = require('../database/config');
const paginate = require('../helpers/paginate');

const getTipoEvaSearch = async (req = request, res = response) => {
    try {
        const {nombre} = req.query;
        const optionsDb = {
            attributes: ['id','nombre'],
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    nombre ? { nombre: { [Op.iLike]: `%${nombre}%`}} : {}                                        
                ],
            },            
        };
        let tipoeva = await TipoEvaluacion.findAll(optionsDb); 
        return res.status(200).json({
            ok: true,
            tipoeva
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const getTipoEvaPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status} = req.query;
        const activo = 1;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { activo },
            include: [
                { association: 'tipo_criterio', attributes:{exclude:['createdAt']} }
            ]
        };
        let tipoEvas = await paginate(TipoEvaluacion, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            tipoEvas
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newTipoEva = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const tipoevaNew = await TipoEvaluacion.create(body);
        return res.status(201).json({
            ok: true,
            tipoevaNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateTipoEva = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const tipoevas = await TipoEvaluacion.findByPk(id);
        await tipoevas.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Tipo de evaluación modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveTipoEva = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const tipoevas = await TipoEvaluacion.findByPk(id);
        await tipoevas.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Tipo de evaluaciones activada exitosamente' : 'Tipo de evaluaciones inactiva exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

module.exports = {
    getTipoEvaPaginate,
    newTipoEva,
    updateTipoEva,
    activeInactiveTipoEva,
    getTipoEvaSearch
};
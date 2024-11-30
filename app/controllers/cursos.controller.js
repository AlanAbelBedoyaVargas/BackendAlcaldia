
const { response, request } = require('express');
const { Op,fn,col } = require("sequelize");
const { Curso,Capacitacion } = require('../database/config');
const paginate = require('../helpers/paginate');

const getCursoSearch = async (req = request, res = response) => {
    try {
        const {nombre} = req.query;
        const optionsDb = {
            attributes: ['id','nombre', 'codigo'],
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [ 
                    nombre ? { nombre: { [Op.iLike]: `%${nombre}%`}} : {}                                        
                ],
                
            },            
        };
        let cursos = await Curso.findAll(optionsDb); 
        return res.status(200).json({
            ok: true,
            cursos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const getCursosPaginate = async (req = request, res = response) => {
    try {
        const {query, page, limit, type, status, activo, uuid, orden} = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id',  orden? orden: 'ASC']],
            where: { 
                [Op.and]: [ 
                    activo? { activo}: {}, 
                    uuid? {uuid} : {},                    
                ],
                
            },
            include: [
                
            ],
        };
        let cursos = await paginate(Curso, page, limit, type, query, optionsDb); 
        const cursoIds = cursos.data.map(cur => cur.id);
        const activeCount = await Capacitacion.findAll({
            attributes: ['id_curso', [fn('COUNT', col('id')), 'actives']],
            where: {
                id_curso: { [Op.in]: cursoIds },
                activo: 1
            },
            group: ['id_curso']
        });
        const activesMap = {};
        activeCount.forEach(count => {
            activesMap[count.id_curso] = parseInt(count.get('actives'),10);
        });
        cursos.data = cursos.data.map(cur => {
            const actives = activesMap[cur.id] || 0;
            return {
                ...cur.toJSON(), // Aseguramos que sea un objeto plano
                actives
            };
        });
        return res.status(200).json({
            ok: true,
            cursos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newCurso = async (req = request, res = response ) => {
    try {
        const body = req.body;
        body.activo = 1;
        const cursoNew = await Curso.create(body);
        return res.status(201).json({
            ok: true,
            cursoNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateCurso = async (req = request, res = response) => {
    try {
        const { uuid } = req.params;
        const body = req.body;
        //const cursos = await Curso.findByPk( uuid);
        const cursos = await Curso.findOne({where: {uuid}} );
        await cursos.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Curso modificado exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const activeInactiveCurso = async (req = request, res = response) => {
    try {
        const { uuid } = req.params;
        const { activo } = req.body;
        const curso = await Curso.findByPk(uuid);
        await curso.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Curso activado exitosamente' : 'Curso inactivo exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}
const toggleActivoCurso = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const curso = await Curso.findByPk(id);

        if (!curso) {
            return res.status(404).json({
                ok: false,
                msg: 'Curso no encontrado'
            });
        }

        // Convertir 'activo' a número para asegurar la comparación correcta
        const currentActivo = parseInt(curso.activo, 10);
        console.log(`Estado actual de 'activo': ${currentActivo}`);

        const newActivo = currentActivo === 1 ? 0 : 1;
        console.log(`Nuevo valor de 'activo': ${newActivo}`);

        await curso.update({ activo: newActivo });

        return res.status(200).json({
            ok: true,
            msg: 'Estado del curso actualizado exitosamente',
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
    getCursosPaginate,
    newCurso,
    updateCurso,
    activeInactiveCurso,
    getCursoSearch,
    toggleActivoCurso
};
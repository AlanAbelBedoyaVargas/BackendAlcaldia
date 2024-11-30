
const { response, request } = require('express');
const { Op } = require('sequelize');
const { CriterioEvaluacion, TipoEvaluacion, sequelize } = require('../database/config');
const paginate = require('../helpers/paginate');

const getCriterioEvaPaginate = async (req = request, res = response) => {
    try {
        let {query, page, limit, type, activo,uuid,nombretipo} = req.query;
        let nombre = nombretipo;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            where: { 
                [Op.and]: [
                    { activo }, uuid? {uuid} : {}, 
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
                { association: 'criterio_tipo',  attributes: {exclude: ['createdAt']},  
                    where: {
                        [Op.and]: [
                            nombre? {nombre} : {}, 
                        ],
                    }
                    /*:type =='capacitacion_curso.tipo' ? {
                        tipo:{[Op.iLike]: `%${filter}%`}
                    }:{},
                    where: {
                        [Op.or]:[
                            { nombre: {[Op.iLike]: `%${filter}%`} },
                            //{tipo:{[Op.iLike]: `%${filter}%`}}
                        ]
                    }*/
                }, 
                //{ association: 'area',  attributes: {exclude: ['createdAt','status','updatedAt']},}, 
            ],
        };
        if(type?.includes('.')){
            type = null;
        }
        let capCriEva = await paginate(CriterioEvaluacion, page, limit, type, query, optionsDb); 
        return res.status(200).json({
            ok: true,
            capCriEva
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newCriterioEva = async (req = request, res = response ) => {
    try {
        const body = req.body;
        const criEvaNew = await CriterioEvaluacion.create(body);
        return res.status(201).json({
            ok: true,
            criEvaNew
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const newTipoCriterio = async (req = request, res = response ) => {
    
    const t = await sequelize.transaction();
    try {
        const { nombre_tipo, id_tipo_evaluacion, nombre_criterio, activo } = req.body;
        const tipoeva = {
            nombre: nombre_tipo,
            activo:1,           
        };
        const criterioeva = {
            nombre: nombre_criterio,
            activo: activo,
        };
        const existDB = await TipoEvaluacion.findOne({ where: { 
            [Op.or]:[
                {  nombre:{[Op.iLike]: `%${tipoeva.nombre}%`}    }
            ],
            },        
        });
        if(existDB){
            let a = JSON.stringify( existDB );
            let b = JSON.parse(a);
            criterioeva.id_tipo_evaluacion = b.id;    
        }else{ //si no existe se creara curso
            const tipoevaNew = await TipoEvaluacion.create(tipoeva, { transaction : t});
            let a = JSON.stringify( tipoevaNew );
            let b = JSON.parse(a);
            criterioeva.id_tipo_evaluacion = b.id;
        }
        
        const criterioevaNew = await CriterioEvaluacion.create(criterioeva, { transaction : t});
        
        await t.commit();
        return res.status(201).json({
            ok: true,
            criterioevaNew,            
        });
    } catch (error) {
        console.log(error);
        await t.rollback();

        //  if (error.includes('file') ) {
        //      res.status(422).json({
        //         ok: false,
        //         errors: [{ msg: `${error}` }],
        //      }); // Send the custom error message as the response
        //  } else {
             res.status(500).json({
                ok: false,
                errors: [{ msg: ` Ocurrió un imprevisto interno | hable con soporte  ${error} ` }],
              });
         //}


        return res;
    }
}


const updateCriterioEva = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const criEva = await CriterioEvaluacion.findByPk(id);
        await criEva.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Criterio Evaluación modificada exitosamente'
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({
          ok: false,
          errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte`}],
        });
    }
}

const updateTipoCriterio = async (req = request, res = response ) => {
    
    const t = await sequelize.transaction();
    try {
        
        const { nombre_tipo, id_tipo_evaluacion, nombre_criterio, activo } = req.body;
        const { uuid } = req.params;
        const tipoeva = {
            nombre: nombre_tipo,
            activo:1,           
        };
        const criterioeva = {
            nombre: nombre_criterio,
            activo: activo,
        };
        const existDB = await TipoEvaluacion.findOne({ where: { 
            [Op.or]:[
                {  nombre:{[Op.iLike]: `%${tipoeva.nombre}%`}    }
            ],
            },
        });
        if(existDB){
            let a = JSON.stringify( existDB );
            let b = JSON.parse(a);
            criterioeva.id_tipo_evaluacion = b.id;    
        }else{ //si no existe se creara curso
            const tipoevaNew = await TipoEvaluacion.create(tipoeva, { transaction : t});
            let a = JSON.stringify( tipoevaNew );
            let b = JSON.parse(a);
            criterioeva.id_tipo_evaluacion = b.id;
        }
        const criEva = await CriterioEvaluacion.findOne({where:{uuid}});
        await criEva.update(criterioeva);
        
        await t.commit();
        return res.status(201).json({
            ok: true,
            criEva,            
        });
    } catch (error) {
        console.log(error);
        await t.rollback();

        res.status(500).json({
        ok: false,
        errors: [{ msg: ` Ocurrió un imprevisto interno | hable con soporte  ${error} ` }],
        });
        
        return res;
    }
}

const activeInactiveCriterioEva = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const criEva = await CriterioEvaluacion.findByPk(id);
        await criEva.update({activo});
        res.status(201).json({
            ok: true,
            msg: activo ? 'Criterio Evaluación activado exitosamente' : 'Criterio evaluación inactivo exitosamente'
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
    getCriterioEvaPaginate,
    newCriterioEva,
    updateCriterioEva,
    activeInactiveCriterioEva,
    newTipoCriterio,
    updateTipoCriterio
};
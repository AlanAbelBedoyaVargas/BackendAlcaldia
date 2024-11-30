const { response, request } = require('express');
const { Op } = require('sequelize');
const { Resap33, ConocimientoExigido, ConocimientoAmpliar, FuncionConocimiento, CapacitadorMateria, sequelize } = require('../database/config');
const paginate = require('../helpers/paginate');

const getResapPaginate = async (req = request, res = response) => {
    try {
        let { query, page, limit, type, activo, id_empleado } = req.query;
        const optionsDb = {
            attributes: { exclude: ['createdAt'] },
            order: [['id', 'ASC']],
            // Simplificar where para pruebas iniciales
            where: {
                [Op.and]: [
                    activo !== undefined ? { activo } : {}, // Filtro por activo
                    id_empleado ? { id_empleado } : {}
                ]
            },
            include: [
                {
                    association: 'resap33_conexigido', // Primera relación
                    attributes: { exclude: ['createdAt'] },
                },
                {
                    association: 'resap33_conampliar', // Primera relación
                    attributes: { exclude: ['createdAt'] },
                },
                {
                    association: 'resap33_func', // Primera relación
                    attributes: { exclude: ['createdAt'] },
                },
                {
                    association: 'resap33_capmateria', // Primera relación
                    attributes: { exclude: ['createdAt'] },
                },
            ],
        };
        if (type?.includes('.')) {
            type = null;
        }
        let resap33 = await paginate(Resap33, page, limit, type, query, optionsDb);

        return res.status(200).json({
            ok: true,
            resap33
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
        });
    }
};
const newResap = async (req = request, res = response) => {
    const t = await sequelize.transaction();
    try {
        const { resap33, conExigido, conAmpliar, funcionCon, capMateria } = req.body;
        // Crear el registro en Resap37
        const newResap33 = await Resap33.create({
            ...resap33,
            activo: 1,  // Configurar campo activo como 1
        }, { transaction: t });

        // // Crear registros en Resap37Criterio asociados al Resap37 creado
        // const conExigidoData = conExigido.map(conExigidos => ({
        //     ...conExigidos,
        //     id_resap33: newResap33.id,  // Asociar criterio con el Resap37 recién creado
        // }));
        //await ConocimientoExigido.bulkCreate(conExigidoData, { transaction: t });

        // Crear registros relacionados en `ConocimientoExigido`
        if (conExigido && conExigido.length > 0) {
            const conExigidoData = conExigido.map(conExigidos => ({
                ...conExigidos,
                id_resap33: newResap33.id,  // Asociar con el `id` recién creado
            }));
            await ConocimientoExigido.bulkCreate(conExigidoData, { transaction: t });
        }

        // Crear registros relacionados en `ConocimientoAmpliar`
        if (conAmpliar && conAmpliar.length > 0) {
            const conAmpliarData = conAmpliar.map(conAmpliars => ({
                ...conAmpliars,
                id_resap33: newResap33.id,  // Asociar con el `id` recién creado
            }));
            await ConocimientoAmpliar.bulkCreate(conAmpliarData, { transaction: t });
        }
        // Crear registros relacionados en `FuncionConocimiento`
        if (funcionCon && funcionCon.length > 0) {
            const funcionConData = funcionCon.map(funciones => ({
                ...funciones,
                id_resap33: newResap33.id,  // Asociar con el `id` recién creado
            }));
            await FuncionConocimiento.bulkCreate(funcionConData, { transaction: t });
        }

        // Crear registros relacionados en `CapacitadorMateria`
        if (capMateria && capMateria.length > 0) {
            const capMateriaData = capMateria.map(materias => ({
                ...materias,
                id_resap33: newResap33.id,  // Asociar con el `id` recién creado
            }));
            await CapacitadorMateria.bulkCreate(capMateriaData, { transaction: t });
        }


        // Confirmar transacción
        await t.commit();

        return res.status(201).json({
            ok: true,
            resap33: newResap33,
            conExigido,
            conAmpliar,
            funcionCon,
            capMateria
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
//Alternativa 1: Eliminar anteriores registros e insetar nuevos registros
// const updateResap = async (req = request, res = response) => {
//     const { id } = req.params;  // ID del Resap37 a actualizar
//     const { resap33, conExigido, conAmpliar, funcionCon, capMateria } = req.body;

//     const t = await sequelize.transaction();

//     try {
//         // Buscar y actualizar el registro de Resap33
//         const existingResap33 = await Resap33.findByPk(id, { transaction: t });
//         if (!existingResap33) {
//             return res.status(404).json({
//                 ok: false,
//                 errors: [{ msg: 'Formulario Resap33 no encontrado' }],
//             });
//         }

//         // Actualizar campos de Resap33
//         await existingResap33.update({
//             ...resap33,
//             activo: resap33.activo || 1,  // Mantiene o establece el estado activo
//         }, { transaction: t });

//         // Actualizar conExigido de Resap33

//         if (conExigido && Array.isArray(conExigido)) {

//             //Eliminar los registro en la bda
//             await ConocimientoExigido.destroy({
//                 where: { id_resap33: id },
//                 transaction: t,
//             });
//             //Insertar nuevos registros
//             const conExigidoData = conExigido.map(conExigidos => ({
//                 ...conExigidos,
//                 id_resap33: id,  // Asociar con el `id` recién creado
//             }));
//             await ConocimientoExigido.bulkCreate(conExigidoData, { transaction: t });
//         }

//         // Actualizar conAmpliar de Resap33

//         if (conAmpliar && Array.isArray(conAmpliar)) {
//             await ConocimientoAmpliar.destroy({
//                 where: { id_resap33: id },
//                 transaction: t,
//             });

//             const conAmpliarData = conAmpliar.map(item => ({
//                 ...item,
//                 id_resap33: id,  // Asociar con el `id` recién creado
//             }));
//             await ConocimientoAmpliar.bulkCreate(conAmpliarData, { transaction: t });
//         }
//         if (funcionCon && Array.isArray(funcionCon)) {
//             await FuncionConocimiento.destroy({
//                 where: { id_resap33: id },
//                 transaction: t,
//             });

//             const funcionConData = funcionCon.map(item => ({
//                 ...item,
//                 id_resap33: id,  // Asociar con el `id` recién creado
//             }));
//             await FuncionConocimiento.bulkCreate(funcionConData, { transaction: t });
//         }
//         if (capMateria && Array.isArray(capMateria)) {
//             await CapacitadorMateria.destroy({
//                 where: { id_resap33: id },
//                 transaction: t,
//             });

//             const capMateriaData = capMateria.map(item => ({
//                 ...item,
//                 id_resap33: id,  // Asociar con el `id` recién creado
//             }));
//             await CapacitadorMateria.bulkCreate(capMateriaData, { transaction: t });
//         }

//         await t.commit();

//         return res.status(200).json({
//             ok: true,
//             msg: 'Formulario Resap33 y sus criterios actualizados exitosamente'
//         });

//     } catch (error) {
//         console.log(error);
//         await t.rollback();
//         return res.status(500).json({
//             ok: false,
//             errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
//         });
//     }
// };

//Alternativa 2: Actualizar los registros existentes y agregar nuevos registros si es necesario
// const updateResap2 = async (req = request, res = response) => {
//     const { id } = req.params;  // ID del Resap33 a actualizar
//     const { resap33, conExigido, conAmpliar, funcionCon, capMateria } = req.body;

//     const t = await sequelize.transaction();
//     try {
//         const existingResap33 = await Resap33.findByPk(id, { transaction: t });
//         if (!existingResap33) {
//             return res.status(404).json({
//                 ok: false,
//                 errors: [{ msg: 'Formulario Resap33 no encontrado' }],
//             });
//         }

//         // Actualizar campos de Resap33
//         await existingResap33.update({
//             ...resap33,
//             activo: resap33.activo || 1,  // Mantiene o establece el estado activo
//         }, { transaction: t });

//         // --- Manejo de Conocimiento Exigido ---
//         if (conExigido && Array.isArray(conExigido)) {
//             // Obtener los registros existentes
//             const existingRecords = await ConocimientoExigido.findAll({
//                 where: { id_resap33: id },
//                 transaction: t,
//             });
        
//             // Crear Mapas para comparar registros
//             const existingMap = new Map(existingRecords.map(record => [record.id, record]));
//             const newItemsWithId = conExigido.filter(item => item.id); // Registros con id
//             const newItemsWithoutId = conExigido.filter(item => !item.id); // Registros sin id
        
//             const newMap = new Map(newItemsWithId.map(item => [item.id, item]));
        
//             // Registros para actualizar, insertar y eliminar
//             const updates = [];
//             const inserts = [...newItemsWithoutId]; // Directamente agregar registros sin id
//             const deletes = [];
        
//             // Comparar registros existentes y nuevos
//             for (const [id, record] of existingMap) {
//                 if (newMap.has(id)) {
//                     // Registro existente que se debe actualizar
//                     const newData = newMap.get(id);
//                     updates.push({
//                         record,
//                         newData,
//                     });
//                     newMap.delete(id); // Ya procesado
//                 } else {
//                     // Registro existente que debe eliminarse
//                     deletes.push(record);
//                 }
//             }
        
//             // Ejecutar actualizaciones
//             for (const { record, newData } of updates) {
//                 await record.update(newData, { transaction: t });
//             }
        
//             // Ejecutar eliminaciones
//             for (const record of deletes) {
//                 await record.destroy({ transaction: t });
//             }
        
//             // Ejecutar inserciones (incluye los nuevos registros sin id)
//             const newRecords = inserts.map(item => ({
//                 ...item,
//                 id_resap33: id, // Asociar al formulario
//             }));
        
//             await ConocimientoExigido.bulkCreate(newRecords, { transaction: t });
//         }

    

//         // Confirmar la transacción
//         await t.commit();

//         return res.status(200).json({
//             ok: true,
//             msg: 'Formulario Resap33 y sus datos relacionados actualizados exitosamente',
//         });

//     } catch (error) {
//         console.error(error);
//         await t.rollback();
//         return res.status(500).json({
//             ok: false,
//             errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
//         });
//     }
// };
//Completando Alternativa 2: Actualizar los registros existentes y agregar nuevos registros si es necesario
//Aquí se completa la idea de la alternativa 2, para actualizar los registros existentes y agregar nuevos registros si es necesario.
async function syncTable(model, id_resap33, newItems, transaction) {
    // Obtener los registros existentes de la tabla relacionados con el formulario
    const existingItems = await model.findAll({
        where: { id_resap33 },
        transaction,
    });

    // Mapear registros existentes (clave: id, valor: registro completo)
    const existingMap = new Map(existingItems.map(item => [item.id, item]));

    // Mapear registros nuevos con id (clave: id, valor: datos nuevos)
    const newItemsWithId = newItems.filter(item => item.id);
    const newMap = new Map(newItemsWithId.map(item => [item.id, item]));

    // Identificar operaciones: updates, inserts, deletes
    const updates = [];
    const inserts = newItems.filter(item => !item.id); // Registros sin ID son nuevos
    const deletes = [];

    for (const [id, record] of existingMap) {
        if (newMap.has(id)) {
            // Si el registro existe en ambos mapas, se actualiza
            const newData = newMap.get(id);
            updates.push({ record, newData });
            newMap.delete(id); // Marcar como procesado
        } else {
            // Si el registro no está en los nuevos datos, se elimina
            deletes.push(record);
        }
    }

    // Ejecutar actualizaciones
    for (const { record, newData } of updates) {
        await record.update(newData, { transaction });
    }

    // Ejecutar eliminaciones
    for (const record of deletes) {
        await record.destroy({ transaction });
    }

    // Ejecutar inserciones
    const newRecords = inserts.map(item => ({
        ...item,
        id_resap33,
    }));
    await model.bulkCreate(newRecords, { transaction });
}
const updateResap2 = async (req, res) => {
    const { id } = req.params;
    // Extraer datos del cuerpo de la solicitud
    const { resap33, conExigido, conAmpliar, funcionCon, capMateria } = req.body;

    const t = await sequelize.transaction(); // Iniciar transacción

    try {
        // Verificar si la entrada principal existe
        const existingResap33 = await Resap33.findByPk(id, { transaction: t });
        if (!existingResap33) {
            return res.status(404).json({ ok: false, msg: "Formulario no encontrado" });
        }

        // Actualizar los datos del formulario principal
        await existingResap33.update(resap33, { transaction: t });


        // Sincronizar cada tabla relacionada
        await syncTable(ConocimientoExigido, id, conExigido, t);
        await syncTable(ConocimientoAmpliar, id, conAmpliar, t);
        await syncTable(FuncionConocimiento, id, funcionCon, t);
        await syncTable(CapacitadorMateria, id, capMateria, t);

        // Confirmar la transacción
        await t.commit();
        return res.status(200).json({ ok: true, msg: "Formulario y datos relacionados actualizados correctamente" });
    } catch (error) {
        console.error(error);
        await t.rollback(); // Revertir la transacción en caso de error
        return res.status(500).json({ ok: false, errors: [{ msg: "Error interno, contacte soporte" }] });
    }
};


//     } catch (error) {
//         console.log(error);
//         await t.rollback();
//         return res.status(500).json({
//             ok: false,
//             errors: [{ msg: `Ocurrió un imprevisto interno | hable con soporte` }],
//         });
//     }
// }

const activeInactiveResap = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { activo } = req.body;
        const resap33 = await Resap33.findByPk(id);
        await resap33.update({ activo });
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
    newResap, activeInactiveResap, getResapPaginate,
    //updateResap,
    updateResap2
};
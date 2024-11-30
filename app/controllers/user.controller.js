
const bcrypt = require('bcrypt');
const generarJWT = require('../helpers/jwt');
const { response, request } = require('express');
const { Users, Empleado } = require('../database/config');
const paginate = require('../helpers/paginate');
const { Op, json } = require("sequelize");
const Infoemp = require('./empleado.controller');
const axios = require('axios');
//const { Emp } = require("./empleado.controller");

const getUsers = async (req = request, res = response) => {
    try {
        const { query, page, limit, type, status, id } = req.query;
        console.log(req.query);
        const optionsDb = {
            attributes: { exclude: ['password', 'createdAt'] },
            order: [['id', 'ASC'],],
            where: {
                //status,
                //rol:{
                //    [Op.ne]: 'DESARROLLADOR'
                //}
                [Op.and]: [
                    id ? { id } : {}
                ],
            },
        };
        let users = await paginate(Users, page, limit, type, query, optionsDb);
        res.status(200).json({
            ok: true,
            users
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

const newUser = async (req = request, res = response) => {
    try {
        const body = req.body;
        const salt = bcrypt.genSaltSync();
        body.password = bcrypt.hashSync(body.password, salt);
        body.rol = "USUARIO";
        //save table empleado
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
            body.id_empleado = existDB.id;
            body.activo = 1;
        } else {
            let json_emp_new = { "cod_empleado": json_e[0].cod_empleado, "ci": json_e[0].num_documento, "nombre": json_e[0].emp_nombre, "otro_nombre": json_e[0].emp_otro_nombre, "paterno": json_e[0].emp_paterno, "materno": json_e[0].emp_materno, "item": json_e[0].emp_asigemp_nro_item, "cargo": json_e[0].emp_car_descripcion, "unidad": json_e[0].emp_unidad, "tipo_contrato": json_e[0].emp_id_tipocontrato, "activo": 1 };
            empleadoNew = await Empleado.create(json_emp_new);
            body.id_empleado = empleadoNew.id;
            body.activo = 1;
        }

        const userNew = await Users.create(body);
        let data = { id: userNew.id, role: userNew.rol }
        const token = await generarJWT(data);
        res.status(201).json({
            ok: true,
            userNew,
            token
        });

    } catch (error) {

        // let message = `Ocurrió un imprevisto interno | hable con soporte`;
        if (error instanceof ReferenceError) {
            message = `El empleado no esta registrado en sistema Planillas`
        } else {
            message = `Ocurrió un imprevisto interno | hable con soporte`;
        }
        return res.status(500).json({
            ok: false,
            errors: [{
                msg: message
            }],
        });
    }
}


const updateUser = async (req = request, res = response) => {
    try {
        console.log(req);
        const { id } = req.params;
        const body = req.body;
        const salt = bcrypt.genSaltSync();
        body.password = bcrypt.hashSync(body.password, salt);
        const user = await Users.findByPk(id);
        await user.update(body);
        return res.status(201).json({
            ok: true,
            msg: 'Usuario modificado exitosamente'
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

const activeInactiveUser = async (req = request, res = response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const user = await Users.findByPk(id);
        await user.update({ status });
        res.status(201).json({
            ok: true,
            msg: status ? 'Usuario activado exitosamente' : 'Usuario inactivo exitosamente'
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

module.exports = {
    getUsers,
    newUser,
    updateUser,
    activeInactiveUser
};

// ----------------------------USUARIOS PARA LA BD------------------
// USUARIO
// ADMINISTRADOR
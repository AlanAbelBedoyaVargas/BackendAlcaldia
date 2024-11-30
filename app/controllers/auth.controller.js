const bcrypt = require('bcrypt');
const generarJWT = require('../helpers/jwt');
const { response } = require('express');
const { Users, Empleado } = require('../database/config');
const { getMenuFrontend } = require('../helpers/menu-fronted');


const login = async (req, res = response) => {
    const {ci, password} = req.body;
    try {
        let user = await Users.findOne({
            where:{ ci },
            attributes: {exclude: ['updatedAt','createdAt']},
        });
        if(!user) {
            return res.status(401).json({
                ok: false,
                errors: [{
                        msg: `El número de documento y/o contraseña son incorrectos`
                    }],
            });
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword){
            return res.status(401).json({
                ok: false,
                errors: [{
                        msg: `El número de documento y/o contraseña son incorrectos`
                    }],
            });
        }
        
        if (!user.status){
            return res.status(401).json({
                ok: false,
                errors: [{
                        msg: `Op's..! Al parecer ya no tienes acceso | Comunícate con tu superior`
                    }],
            });
        }
        
        //let data = { id:user.id, ol }
        const token = await generarJWT(user.id);
        const menu = getMenuFrontend(user.rol);

        let a = JSON.stringify( user );
        let b = JSON.parse(a);
        let id = b.id_empleado;
        let emp = await Empleado.findOne({
            where:{ id  },
            attributes: {exclude: ['updatedAt','createdAt' ]},
        });
        
        res.status(200).json({
            ok: true,
            user,
            token,
            nameSystem:process.env.NAMESYSTEM,
            menu,
            emp,
            status: user.status,
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


const renewToken = async (req , res = response) => {
    try {
        const id = req.userAuth.id;
        const token = await generarJWT(id);
        const user = await Users.findByPk(id);
        const menu = getMenuFrontend(user.rol);

        let a = JSON.stringify( user );
        let b = JSON.parse(a);
        id = b.id_empleado;
        let emp = await Empleado.findOne({
            where:{ id  },
            attributes: {exclude: ['updatedAt','createdAt' ]},
        });

        res.status(200).json({
            ok: true,
            user,
            token,
            nameSystem:process.env.NAMESYSTEM,
            menu,
            emp,
            status: user.status,
        });     
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            errors: [{
                    msg: `Op's..! Al parecer ya no tienes acceso | Comunícate con tu superior`
                }],
        });
    }
}

module.exports = {
    login,
    renewToken
}
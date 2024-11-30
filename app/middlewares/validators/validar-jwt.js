const {response} = require('express');
const jwt = require('jsonwebtoken');
const { Users } = require('../../database/config');

const validarJWT = async (req, res = response , next) =>{
    try {
        const token = req.header('Authorization');  
        if(!token) {
            return res.status(401).json({
                ok: false,
                errors: [{
                        value: token,
                        msg: `Introduce el token en los headers | Authorization`
                    }],
            });
        }
        const { id } = jwt.verify(token, process.env.JWT_SECRET);        
        const user = await Users.findByPk(id);
        
        if ( user.status == false ){
            return res.status(401).json({
                ok: false,
                errors: [{
                        msg: `Opps..! Al parecer ya no tienes acceso | Comunicate con tu superior`
                    }],
            });
        }
        
        req.userAuth = user;        
        next();
    } catch (error) {
        return res.status(401).json({
                ok: false,
                errors: [{
                        msg: `Opps..! Al parecer ya venció tu sesión`,
                        error
                    }],
            });
    } 
}

module.exports = {
    validarJWT
}
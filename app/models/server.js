const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { sequelize } = require('../database/config');

class Server {
    static _instance;
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.middlewares();
        this.routes();
    }
    static get instance() {
        return this._instance || (this._instance = new Server());
    }
    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(express.static('uploads'));
    }

    routes() {
        const dirname = path.join(__dirname, '../routes');
        //const dirnameServices = path.join(__dirname, '../routes/services/app');
        fs.readdirSync(dirname)
            .filter(file => {
                return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
            })
            .forEach(file => {
                this.app.use(`/api/v1/${file.slice(0, -3)}`, require(`../routes/${file.slice(0, -3)}`));
            });
        /*fs.readdirSync(dirnameServices)
            .filter(file => {
                return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
            })
            .forEach(file => {
                this.app.use(`/api/v1/${file.slice(0, -3)}`, require(`../routes/services/app/${file.slice(0, -3)}`));
            });
            */
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Ejecuto en puerto : ', this.port);
        });
        sequelize.sync({ forse: false }).then(() => {
            console.log('Conexión exitosa a la base de datos');
        });
    }

}

module.exports = Server;
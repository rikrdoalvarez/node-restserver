require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'RESTServer API para mantención de usuarios',
            // version: '1.0.0',
            description: 'Esta API contiene el CRUD de la información del usuario' //,
                // license: {
                //     name: 'MIT',
                //     url: 'https://choosealicense.com/licenses/mit/'
                // },
                // contact: {
                //     name: 'Swagger',
                //     url: 'https://swagger.io',
                //     email: 'Info@SmartBear.com'
                // }
        },
        servers: [{
            url: 'http://localhost:3000'
        }]
    },
    apis: ['./server/models/usuario.js', './server/routes/usuario.js']
};
// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use('/docs', swaggerUi.serve);
// app.get(
//     '/docs',
//     swaggerUi.setup(swaggerDocs, {
//         explorer: true
//     })
// );
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// Configuración global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuhando puerto: ${process.env.PORT}`);
});
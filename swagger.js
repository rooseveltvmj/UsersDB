import 'dotenv/config';
import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Minha API',
        descripition: "Uma simples API !"
    },
    host: 'localhost:' + process.env.SERVER_PORT,
    schemes: ['http']
}

const outputFile = './swagger-output.json';
const routes = ['./server.js'];

swaggerAutogen()(outputFile, routes, doc);
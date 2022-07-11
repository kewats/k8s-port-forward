const fastify = require('fastify')({logger: true});
const initRoutes = require('./routes.js');

initRoutes(fastify);

fastify.listen({ port: 3000 }, (err, address) => {
    if (err) throw err;
});
const axios = require('axios').default;
const portForward = require('./port-forward.js');

function initRoutes(fastify) {

    fastify.get('/', function(req, reply) {
        reply
            .send({ hello: 'world' });
    });

    fastify.get('/posts', async function(req, reply) {
        let {server, port} = await portForward();

        return axios.get(`http://localhost:${port}/posts`)
            .then(function(res) {
                reply.send(res.data);
            })
            .finally(function() {
                server.close();
            });
    })
}

module.exports = initRoutes;

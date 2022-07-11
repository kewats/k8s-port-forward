const k8s = require('@kubernetes/client-node');
const net = require('net');

async function portFoward() {
    const kc = new k8s.KubeConfig();
    kc.loadFromDefault();
    
    const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
    
    let runningPodName;
    
    await k8sApi.listNamespacedPod('default').then((res) => {
        const pods = res.body.items;
    
        // todo: pick a random pod, instead of the first always
        for (const p of pods) {
            if (p.status.phase === 'Running') {
                console.log('Picking: ' + p.metadata.name);
                runningPodName = p.metadata.name;
                break;
            }
        }
    });
    
    const forward = new k8s.PortForward(kc);
    const server = net.createServer((socket) => {
        forward.portForward('default', runningPodName, [80], socket, null, socket);
    });
    
    server.listen(0, 'localhost');

    let port;
    await new Promise((resolve, reject) => {
        server.on('listening', function() {
            port = server.address().port;
            resolve();
        });
    });
    return {server, port};
}

module.exports = portFoward;

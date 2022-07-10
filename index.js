const k8s = require('@kubernetes/client-node');
const net = require('net');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

let runningPodName;

k8sApi.listNamespacedPod('default').then((res) => {
    const pods = res.body.items;

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

server.listen(3000, 'localhost');

# k8s-port-forward

Setup a local kubernetes cluster:

`kind create cluster`

Setup json-server insider k8s cluster:

`kubectl create configmap json-server-test-config --from-file=db.json`

`kubectl create -f deployment.yaml`

Start k8s port forwarding:

`npm install`

`node index.js`

Access json-server api using curl:

`curl localhost:3000/posts`

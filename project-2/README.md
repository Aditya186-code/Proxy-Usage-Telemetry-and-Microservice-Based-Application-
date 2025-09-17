
## Installation

1. Start Minikube

```bash
minikube start --driver=docker
```

2. For running application using docker-compose

```bash
docker-compose up -d
```
3. For running application using kubernetes
```bash
./script.sh
```
4. Access the frontend using

```bash
minikube ip
```

## Pipeline
Gilab CI is used for the CI/CD setup. The .gitlab-ci.yml files contain all the pipeline stages.

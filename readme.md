## Default Image Name

```
<project-name>_<service-name>:latest
```

## To set Proper Name - Set in docker-compose.yml

```
image: auth-service:latest
```

## To Login DockerHub

```
docker login
```

## Docker File

Defines how to build a <b>single image</b>.</br>
It’s like a recipe for one container.</br>
Written step by step (FROM, RUN, COPY, CMD, etc.).</br>

### to build and run it
```
docker build -t auth-service .
docker run -p 8001:8001 auth-service
```

## Docker Compose

Defines and runs multi-container applications together.</br>
It tells Docker:</br>
- Which images to use (build or pull).
- How containers connect to each other.
- Networks, volumes, env variables, ports, healthchecks, etc.</br>

It’s like the orchestrator for multiple services.

### to build them in once
```
docker-compose up --build
```
## To get List of Docker Images
```
docker images
```
# Remove Docker Images

### Using Image_ID
```
docker rmi IMAGE_ID
```
### Using Image_Tag
```
docker rmi REPOSITORY:TAG
```
### Remove all unused images (dangling images)
```
docker rmi REPOSITORY:TAG
```
```
docker image prune -a
```
### Force removal
```
docker rmi -f IMAGE_ID
```
### Remove all Docker images
```
docker rmi $(docker images -q)
```
## Stop all running containers
```
docker stop $(docker ps -q)
```
## Tag Images for Docker Hub

```
docker tag auth-service:latest umeshgayashan/auth-service:latest
docker tag hotel-service:latest umeshgayashan/hotel-service:latest
docker tag booking-service:latest umeshgayashan/booking-service:latest
docker tag payment-service:latest umeshgayashan/payment-service:latest
docker tag node:20-alpine umeshgayashan/frontend:latest
docker tag nginx:1.27-alpine umeshgayashan/gateway:latest
```

## Push Images to Docker Hub

```
docker push umeshgayashan/auth-service:latest
docker push umeshgayashan/hotel-service:latest
docker push umeshgayashan/booking-service:latest
docker push umeshgayashan/payment-service:latest
docker push umeshgayashan/frontend:latest
docker push umeshgayashan/gateway:latest
```
# Kubernetes (K8s)

- A container orchestration system.

- Helps you run, scale, and manage containers across multiple machines (or even just one laptop).

### Why it’s useful:

- Automatically restarts containers if they fail.
- Can run multiple replicas of a service to handle more traffic.
- Manages networking so services can find each other.
- Handles persistent storage for databases.</br>

Think of Kubernetes as the manager of all containers, making sure they work correctly, scale properly, and can communicate with each other.

# Kubernetes Cluster

A group of machines (nodes) where Kubernetes runs containers.

Components of a cluster:

- Control Plane (Master Node): Decides where containers should run, manages the cluster, and monitors health.
- Worker Nodes: Run actual containers (pods).

Even if run it locally on  laptop, still have a “cluster” with a control plane and one node (Minikube simulates this).

# Minikube - Without Cloud Provider

A lightweight tool to run a Kubernetes cluster locally on laptop.

How it works:

- Starts a small virtual machine or Docker container that acts as a Kubernetes node.
- Runs a single-node cluster with a control plane and worker node.

Think of Minikube as a mini Kubernetes lab on laptop.

# kubectl

The command-line tool for Kubernetes.

Purpose: talk to Kubernetes cluster.

What you can do with it:

- Deploy applications: kubectl apply -f auth-mysql.yaml
- Check running pods: kubectl get pods
- Inspect services: kubectl get svc
- Delete resources: kubectl delete -f auth-mysql.yaml

Think of kubectl as the remote control for Kubernetes cluster.
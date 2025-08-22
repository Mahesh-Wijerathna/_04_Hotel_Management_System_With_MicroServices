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
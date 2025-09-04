# gateway/Dockerfile
FROM nginx:1.27-alpine

# Remove the default config
RUN rm /etc/nginx/nginx.conf

# Copy your custom config into container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (inside container)
EXPOSE 80

# Default CMD is already "nginx -g 'daemon off;'" in the base image

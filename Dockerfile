FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist-site/ /usr/share/nginx/html/

EXPOSE 8080

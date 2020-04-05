FROM nginx:1.17.9-alpine

copy ./dist/try-influx/ /usr/share/nginx/html/

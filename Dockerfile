FROM node:8.9.3

MAINTAINER ciqulover@gmail.com

COPY . /home/disqus-proxy-server

WORKDIR /home/disqus-proxy-server

RUN npm install && \
    npm install pm2 -g

CMD [ "pm2-docker", "server.js" ]

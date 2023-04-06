FROM nginx

COPY ./dist/ /usr/share/nginx/html/
COPY ./docker/myapp.conf /etc/nginx/sites-available/myapp.conf
COPY ./docker/myapp.conf /etc/nginx/sites-enabled/myapp.conf
COPY ./docker/vhosts.conf /etc/nginx/conf.d/vhosts.conf

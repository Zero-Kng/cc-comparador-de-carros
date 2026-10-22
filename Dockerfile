FROM php:8.3-apache

ENV PORT=10000

RUN sed -i 's/Listen 80/Listen ${PORT}/' /etc/apache2/ports.conf \
 && sed -i 's/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/' /etc/apache2/sites-available/000-default.conf \
 && printf '<Directory /var/www/html>\n    Options -Indexes\n</Directory>\n' > /etc/apache2/conf-enabled/sem-listagem.conf

COPY . /var/www/html/

EXPOSE 10000

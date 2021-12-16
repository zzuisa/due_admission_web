FROM nginx
LABEL Ao zzuisa.cn@gmail.com
COPY dist/ /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
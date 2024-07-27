FROM debian:12

# install mongodb
RUN apt update && apt install curl gnupg -y && \
	curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
	gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor && \
	echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/7.0 main" | \
	tee /etc/apt/sources.list.d/mongodb-org-7.0.list && \
	apt update && apt upgrade -y && apt install mongodb-org -y

# install app
RUN apt install chromium yarnpkg -y
COPY app /app
RUN cd /app && PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarnpkg install && yarnpkg build

RUN useradd chal && ln -nsf /tmp /home/chal

COPY ./init-data.js /
COPY ./init.sh /
CMD ["/init.sh"]

FROM node:11.13

LABEL maintainer="Harry Reeder <harry@reeder.dev>"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/

RUN yarn

CMD [ "yarn", "run", "run" ]
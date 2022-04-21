FROM node:lts-alpine@sha256:fb6cb918cc72869bd625940f42a7d8ae035c4e786d08187b94e8b91c6a534dfd

# create destination directory
RUN mkdir -p /usr/src/nuxt-app
WORKDIR /usr/src/nuxt-app

# update and install dependency
RUN apk update && apk upgrade

# copy only what is needed for npm install for faster docker builds
COPY package*.json .npmrc ./

RUN npm ci --only-production

# copy the app, note .dockerignore
COPY ./ /usr/src/nuxt-app/

# run the build
RUN npm run build

# set app serving to permissive / assigned
ENV NUXT_HOST=0.0.0.0

# start the app
CMD [ "npm", "start" ]
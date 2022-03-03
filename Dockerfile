FROM node:gallium-bullseye-slim

WORKDIR /app

COPY ./ /app/

RUN yarn

RUN yarn build

ENTRYPOINT ["/app/entrypoint.sh"]

CMD ["yarn", "start"]

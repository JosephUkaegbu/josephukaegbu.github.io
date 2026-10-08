FROM node:20-alpine
WORKDIR /app
COPY aba-run ./aba-run
COPY aba-run/server.js ./server.js
ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080
CMD ["node","server.js"]

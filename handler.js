const next = require('next');
const serverless = require('serverless-http');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  module.exports.next = serverless((event, context) => {
    return handle(event, context);
  });
});
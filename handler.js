const serverless = require('serverless-http');
const next = require('next');

let nextApp;
let handler;

async function setup() {
  if (!nextApp) {
    nextApp = next({ dev: false }); // 'dev: false' para produção
    await nextApp.prepare();
    handler = nextApp.getRequestHandler();
  }
}

module.exports.nextApp = async (event, context) => {
  await setup();
  return serverless(async (req, res) => {
    await handler(req, res);
  })(event, context);
};
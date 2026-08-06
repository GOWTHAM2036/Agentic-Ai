const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`AgentFlow AI Backend Engine running on port ${PORT} [${config.env}]`);
  logger.info(`Healthcheck URL: http://localhost:${PORT}/health`);
});

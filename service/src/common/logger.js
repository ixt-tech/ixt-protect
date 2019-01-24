import { createLogger } from 'bunyan';

const log = createLogger({
  name: process.env.SERVICE_NAME,
  src: process.env.IS_OFFLINE,
});

export default log;
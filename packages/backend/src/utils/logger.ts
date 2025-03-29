import pino from "pino";
import config from "config";
import { hostname } from "os";

const logLevel: string = config.get("log.level");

export const logger = pino({
  level: logLevel,
  formatters: {
    bindings() {
      return {
        hostname: hostname(),
      };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

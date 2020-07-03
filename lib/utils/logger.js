'use strict';

const path = require('path');
const winston = require('winston');

const {format, transports} = winston;
const {colorize, combine, errors, printf, splat, timestamp} = format;

const print = printf((info) => {
  const log = `${info.timestamp} - ${info.level}: ${info.message}`;
  return info.stack ? `${log}\n${info.stack}` : log;
});

let consoleLogger;
let fileLogger;

exports.setup = (config) => {
  consoleLogger = winston.createLogger({
    level: config.level,
    format: combine(
      errors({stack: true}),
      timestamp(),
      colorize(),
      splat(),
      print,
    ),
    transports: [
      new transports.Console({
        handleExceptions: true,
      }),
    ],
  });

  fileLogger = winston.createLogger({
    level: config.level,
    format: combine(
      errors({stack: true}),
      timestamp(),
      splat(),
      print,
    ),
    transports: [
      new transports.File({
        filename: path.resolve(config.filename),
        handleExceptions: true,
      }),
    ],
  });
};

exports.debug = (...args) => {
  if (consoleLogger && fileLogger) {
    consoleLogger.debug(...args);
    fileLogger.debug(...args);
  }
};

exports.info = (...args) => {
  if (consoleLogger && fileLogger) {
    consoleLogger.info(...args);
    fileLogger.info(...args);
  }
};

exports.warn = (...args) => {
  if (consoleLogger && fileLogger) {
    consoleLogger.warn(...args);
    fileLogger.warn(...args);
  }
};

exports.error = (...args) => {
  if (consoleLogger && fileLogger) {
    consoleLogger.error(...args);
    fileLogger.error(...args);
  }
};

exports.console = () => consoleLogger;

exports.file = () => fileLogger;

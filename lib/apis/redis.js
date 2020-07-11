'use strict';

// eslint-disable-next-line import/no-self-import
const redis = require('redis');

let client;

exports.setup = (config) => {
  const {logger} = config;
  client = redis.createClient({
    host: config.host,
    port: config.port,
    password: config.password,
  });
  client.on('connect', () => {
    logger.info('Connection established with Redis');
  });
  client.on('reconnecting', () => {
    logger.info('Reconnecting to Redis...');
  });
  client.on('end', () => {
    logger.info('Connection with Redis was lost');
  });
  client.on('error', (err) => {
    logger.error(err);
  });
};

exports.getClient = () => client;

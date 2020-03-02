/**
 * Description: Client A Net Connection with Server with emit severals message second by second Without Close Socket.
 */

/** Require generics dependences */
import net from 'net';
import pino from 'pino';
import connection from '../config/connection.js';

// Set pino for get pretty logs.
const logger = pino({
  prettyPrint: { colorize: true }
})

// Define main variables.
let clientId;

const client = net.createConnection({
  host: connection.HOST,
  port: connection.PORT,
}, () => {
  logger.info('Connected with server!');
});

client.on('connect', () => {
  logger.info('Client connected');
});

client.on('ready', () => {
  logger.info('Client ready');
});

client.on('data', (data) => {
  logger.warn(data);
  // Clear terminal.
  process.stdout.write('\x1b[2J');
  // Resolve data buffer.
  const body = JSON.parse(data.toString());
  // Show message from server.
  logger.info(body.message);
});

client.on('end', () => {
  logger.info('Disconnected from server');
});

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
  // Clear terminal.
  process.stdout.write('\x1b[2J');
  // Show message from server.
  logger.info(data.toString());
});

client.on('end', () => {
  console.log('Disconnected from server');
});
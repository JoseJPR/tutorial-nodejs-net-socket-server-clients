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
  // Clear terminal.
  process.stdout.write('\x1b[2J');
  // Resolve data buffer.
  const body = JSON.parse(data.toString());
  // If message is a object, search clientId to send message to others clients via server.
  if (typeof body === 'object' && body.clientId) {
    clientId = body.clientId;
    // Show Message.
    logger.info(body.message);
  }
});

client.on('end', () => {
  logger.info('Disconnected from server');
});

// Interval to get clientId and if exist send message to server.
setInterval(() => {
  // Send messages to others clients via server.
  if (clientId) {
    // Clear terminal.
    process.stdout.write('\x1b[2J');
    // Send message to others clients.
    const body = {
      clientId,
      message: `Hi ALL from Client: ${clientId}, this is a timestamp: ${Date.now()}`
    };
    client.write(JSON.stringify(body));
    // Show log with message sent.
    logger.info(body.message);
  }
}, 2000);

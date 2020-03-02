/**
 * Description: Create Net Server and two clients and send Message to differents client Pear to Pear.
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
let server;
const clients = [];

// Function to show clients number connected.
const showClientsConnected = () => {
  server.getConnections((err, count) => {
    if (err) throw err;
    logger.info(`Connections Number: ${count} and Clients registerd in array: ${clients.length}`);
  });
};

// Function to send message to all clients.
const broadcastEmitter = (data) => {
  // Resolve data buffer and parse to JSON.
  const body = JSON.parse(data.toString());
  // If message is a object, search clientId to send message to others clients via server.
  if (typeof body === 'object' && body.clientId) {
    clients.forEach((client) => {
      if(client.id !== body.clientId) {
        client.write(JSON.stringify({
          message: body.message,
        }));
      }
    })
  }
}

// Remove client from array
const removeClient = (clientId) => {
  // Get index position of client into array by id.
  const index = clients.findIndex((e) => e.id === clientId);
  // Remove client from array by index.
  clients.splice(index, 1);
}

// Function to register client into array clients for set an id.
const registerClient = (socket) => {
  // Generate Id from timestamp.
  const id = Date.now();

  // Define socket local to save all object.
  const _socket = socket;
  _socket.id = id;
  
  // Add into clients array a new client reference.
  clients.push(_socket);

  // Send message to client with custom id.
  _socket.write(JSON.stringify({
    clientId: id,
    message: `Your Client Id is: ${id}`
  }));

  // On received data sent to all others clients that are waitting a message.
  _socket.on('data', (data) => {
    // Data Listener.
    logger.warn(`Data received`);

    // Emit message to all clients.
    broadcastEmitter(data);
  });

  _socket.on('end', () => {
    // End Listener.
    logger.warn(`Client disconnected with id: ${_socket.id}`);

    // Remove Client by Id
    removeClient(_socket.id);

    // Show Clients number connected.
    showClientsConnected();
  });
  _socket.pipe(_socket);
};

// Create Server Net.
server = net.createServer((socket) => {
  // Connection Listener.
  logger.warn('Client connected');

  // Show Clients number connected.
  showClientsConnected();

  // Register client into array for send message to a client.
  registerClient(socket);
});

server.on('error', (err) => {
  logger.error(err);
});

// Define host and port of server.
server.listen({
  host: connection.HOST,
  port: connection.PORT,
}, () => {
  // Get and show info of server.
  const info = server.address();
  logger.info(`Server Net actived on: ${info.address} and port: ${info.port}`);
});

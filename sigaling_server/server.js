const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001, host: '0.0.0.0' }); // <-- Bind to all interfaces

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // Broadcast received message to all other connected clients
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

console.log('WebSocket server is running on ws://0.0.0.0:3001');

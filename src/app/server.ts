import http from 'http';
import { WebSocketServer } from 'ws';
import { createApp } from './app';
import { createContainer } from './container';

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer();
const wss = new WebSocketServer({ server });

const { simulationController } = createContainer(wss);
const app = createApp(simulationController);

server.on('request', app);

wss.on('connection', (socket) => {
    socket.send(
        JSON.stringify({
            event: 'connected',
            data: { message: 'WebSocket connection established' }
        })
    );
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

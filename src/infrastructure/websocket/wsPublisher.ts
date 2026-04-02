import { WebSocketServer, WebSocket } from 'ws';
import { EventPublisher } from '../../application/ports/eventPublisher';

export class WsPublisher implements EventPublisher {
    constructor(private readonly wss: WebSocketServer) {}

    publish(event: string, payload: unknown): void {
        const message = JSON.stringify({ event, data: payload });

        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                try {
                    client.send(message);
                } catch (error) {
                   console.log("Websocket error", error);
                }
            }
        });
    }
}

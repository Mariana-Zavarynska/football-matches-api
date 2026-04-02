import { WebSocketServer } from 'ws';
import { InMemorySimulationRepository } from '../infrastructure/repositories/inMemorySimulation.repository';
import { NodeClock } from '../infrastructure/clock/nodeClock';
import { WsPublisher } from '../infrastructure/websocket/wsPublisher';
import { SimulationService } from '../application/services/simulation.service';
import { createSimulationController } from '../presentation/http/controllers/simulation.controller';

export const createContainer = (wss: WebSocketServer) => {
    const simulationRepository = new InMemorySimulationRepository();
    const clock = new NodeClock();
    const publisher = new WsPublisher(wss);

    const simulationService = new SimulationService(
        simulationRepository,
        publisher,
        clock
    );

    const simulationController = createSimulationController(simulationService);

    return {
        simulationRepository,
        clock,
        publisher,
        simulationService,
        simulationController
    };
};

import {InMemorySimulationRepository} from "../src/infrastructure/repositories/inMemorySimulation.repository";
import {NodeClock} from "../src/infrastructure/clock/nodeClock";
import {createSimulationController} from "../src/presentation/http/controllers/simulation.controller";
import {SimulationService} from "../src/application/services/simulation.service";
import {createApp} from "../src/app/app";

class NoopPublisher {
    publish(): void {}
}
export const createTestApp = () => {
    const repository = new InMemorySimulationRepository();
    const publisher = new NoopPublisher();
    const clock = new NodeClock();

    const service = new SimulationService(repository, publisher, clock);
    const controller = createSimulationController(service);

    const app = createApp(controller);

    return {
        app,
        repository,
    };
};

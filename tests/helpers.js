"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestApp = void 0;
const inMemorySimulation_repository_1 = require("../src/infrastructure/repositories/inMemorySimulation.repository");
const nodeClock_1 = require("../src/infrastructure/clock/nodeClock");
const simulation_controller_1 = require("../src/presentation/http/controllers/simulation.controller");
const simulation_service_1 = require("../src/application/services/simulation.service");
const app_1 = require("../src/app/app");
class NoopPublisher {
    publish() { }
}
const createTestApp = () => {
    const repository = new inMemorySimulation_repository_1.InMemorySimulationRepository();
    const publisher = new NoopPublisher();
    const clock = new nodeClock_1.NodeClock();
    const service = new simulation_service_1.SimulationService(repository, publisher, clock);
    const controller = (0, simulation_controller_1.createSimulationController)(service);
    const app = (0, app_1.createApp)(controller);
    return {
        app,
        repository,
    };
};
exports.createTestApp = createTestApp;

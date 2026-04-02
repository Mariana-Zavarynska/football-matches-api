import { Simulation } from '../../../domain/entities/simulation';

export const toSimulationDto = (simulation: Simulation) => ({
    id: simulation.id,
    name: simulation.name,
    status: simulation.status,
    startedAt: simulation.startedAt,
    finishedAt: simulation.finishedAt,
    elapsedTicks: simulation.elapsedTicks,
    matches: simulation.matches
});

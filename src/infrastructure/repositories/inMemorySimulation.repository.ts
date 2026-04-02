import { SimulationRepository } from '../../application/ports/simulation.repository';
import { Simulation } from '../../domain/entities/simulation';

export class InMemorySimulationRepository implements InMemorySimulationRepository {
    private readonly store = new Map<string, Simulation>();

    async save(simulation: Simulation): Promise<void> {
        this.store.set(simulation.id, simulation);
    }

    async getById(id: string): Promise<Simulation | null> {
        return this.store.get(id) ?? null;
    }

    async getAll(): Promise<Simulation[]> {
        return Array.from(this.store.values());
    }
}
